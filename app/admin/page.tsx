export const dynamic = "force-dynamic";
export const revalidate = 0;

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase, supabaseAdmin } from "../lib/supabase";
import fs from "fs";
import path from "path";
import AdminClient from "./AdminClient";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
  "user_3AjIcCtvCn5wdcF1RPZEhGV1RFj",
];

async function getAllQuizzes() {
  const quizzes: any[] = [];
  const slugsSeen = new Set<string>();

  try {
    const dir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const slug = file.replace(".json", "");
      quizzes.push({
        slug,
        title: content.title,
        game: content.game,
        difficulty: content.difficulty,
        questions: content.questions?.length || 0,
        source: "static",
        status: "published",
      });
      slugsSeen.add(slug);
    }
  } catch (e) {}

  try {
    const { data } = await supabase
      .from("quizzes")
      .select("slug, title, game, difficulty, questions, angle, source, status, published_at")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (data) {
      for (const q of data) {
        if (!slugsSeen.has(q.slug)) {
          quizzes.push({
            slug: q.slug,
            title: q.title,
            game: q.game,
            difficulty: q.difficulty,
            questions: Array.isArray(q.questions) ? q.questions.length : 10,
            angle: q.angle,
            status: q.status || "published",
            published_at: q.published_at,
            source: q.source || "generated",
          });
          slugsSeen.add(q.slug);
        }
      }
    }
  } catch (e) {}

  return quizzes;
}

async function getStats() {
  const { count: totalPlays } = await supabase.from("plays").select("*", { count: "exact", head: true });
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true });
  const { count: totalFlags } = await supabase.from("flags").select("*", { count: "exact", head: true }).eq("status", "open");
  const { count: generatedQuizzes } = await supabase.from("quizzes").select("*", { count: "exact", head: true });
  return { totalPlays: totalPlays || 0, totalUsers: totalUsers || 0, totalFlags: totalFlags || 0, generatedQuizzes: generatedQuizzes || 0 };
}

async function getFlags() {
  const { data } = await supabase.from("flags").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(50);
  return data || [];
}

async function getTopQuizzes() {
  const { data } = await supabase.from("plays").select("quiz_slug").limit(1000);
  if (!data) return [];
  const counts: Record<string, number> = {};
  for (const row of data) counts[row.quiz_slug] = (counts[row.quiz_slug] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([slug, plays]) => ({ slug, plays }));
}

async function getCronLogs() {
  const { data } = await supabase.from("cron_logs").select("*").order("created_at", { ascending: false }).limit(50);
  return data || [];
}

async function getCurrentSeason() {
  const { data } = await supabase
    .from("seasons")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data || null;
}

async function getSeasonStandings(seasonStartDate?: string) {
  // Use season's start_date month, not current month.
  // This ensures admin shows correct data even after season ends.
  const currentMonth = seasonStartDate
    ? seasonStartDate.substring(0, 7)
    : new Date().toISOString().substring(0, 7);

  const { data: scores } = await supabase
    .from("scores")
    .select("user_id, weighted_score, score, total_questions")
    .eq("month", currentMonth)
    .eq("is_first_attempt", true);

  if (!scores || scores.length === 0) return [];

  const userMap: Record<string, any> = {};
  for (const row of scores) {
    if (!userMap[row.user_id]) userMap[row.user_id] = { total_score: 0, quizzes: 0, correct: 0, total_questions: 0 };
    userMap[row.user_id].total_score += row.weighted_score || 0;
    userMap[row.user_id].quizzes += 1;
    userMap[row.user_id].correct += row.score || 0;
    userMap[row.user_id].total_questions += row.total_questions || 0;
  }

  const userIds = Object.keys(userMap);
  const { data: users } = await supabase.from("users").select("id, username, streak, is_flagged, disqualified").in("id", userIds);
  const usersById: Record<string, any> = {};
  for (const u of users || []) usersById[u.id] = u;

  const { data: results } = await supabase.from("season_results").select("user_id, reward_status").in("user_id", userIds);
  const rewardByUser: Record<string, string> = {};
  for (const r of results || []) rewardByUser[r.user_id] = r.reward_status;

  return userIds
    .map(uid => ({
      user_id: uid,
      username: usersById[uid]?.username || "Unknown",
      streak: usersById[uid]?.streak || 0,
      is_flagged: usersById[uid]?.is_flagged || false,
      disqualified: usersById[uid]?.disqualified || false,
      monthly_score: userMap[uid].total_score,
      quizzes_completed: userMap[uid].quizzes,
      avg_accuracy: userMap[uid].total_questions > 0 ? Math.round((userMap[uid].correct / userMap[uid].total_questions) * 100) : 0,
      qualifies: userMap[uid].quizzes >= 10,
      reward_status: rewardByUser[uid] || "pending",
    }))
    .sort((a, b) => b.monthly_score - a.monthly_score)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

async function getFlaggedUsers() {
  const { data } = await supabase.from("users").select("id, username, xp, streak, is_flagged, flag_reason").eq("is_flagged", true);
  return data || [];
}

async function getPrizeClaims() {
  const { data: claims } = await supabaseAdmin
    .from("prize_claims")
    .select("id, user_id, season_id, roblox_username, email, discord, status, submitted_at")
    .order("submitted_at", { ascending: false });

  if (!claims || claims.length === 0) return [];

  const userIds = claims.map(c => c.user_id);
  const { data: users } = await supabaseAdmin.from("users").select("id, username").in("id", userIds);
  const usersById: Record<string, any> = {};
  for (const u of users || []) usersById[u.id] = u;

  const { data: results } = await supabaseAdmin.from("season_results").select("user_id, rank").in("user_id", userIds);
  const rankByUser: Record<string, number> = {};
  for (const r of results || []) rankByUser[r.user_id] = r.rank;

  return claims.map(c => ({
    ...c,
    username: usersById[c.user_id]?.username || "Unknown",
    rank: rankByUser[c.user_id] || null,
  }));
}

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) redirect("/");

  // Fetch season first so we can pass start_date to getSeasonStandings
  const season = await getCurrentSeason();

  const [quizzes, stats, flags, topQuizzes, cronLogs, seasonStandings, flaggedUsers, prizeClaims] = await Promise.all([
    getAllQuizzes(),
    getStats(),
    getFlags(),
    getTopQuizzes(),
    getCronLogs(),
    getSeasonStandings(season?.start_date),
    getFlaggedUsers(),
    getPrizeClaims(),
  ]);

  return (
    <AdminClient
      quizzes={quizzes}
      stats={stats}
      flags={flags}
      topQuizzes={topQuizzes}
      cronLogs={cronLogs}
      seasonStandings={seasonStandings}
      flaggedUsers={flaggedUsers}
      season={season}
      prizeClaims={prizeClaims}
    />
  );
}