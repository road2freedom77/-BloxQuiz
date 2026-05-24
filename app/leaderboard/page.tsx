import { supabaseAdmin } from "../lib/supabase";
import LeaderboardClient from "./LeaderboardClient";

export const revalidate = 0;

export const metadata = {
  title: "Leaderboard — Top Roblox Quiz Players | BloxQuiz",
  description: "See the top Roblox quiz players on BloxQuiz.gg. Compete for Roblox gift cards up to $20. Quarterly seasons — top 3 players win real prizes!",
  alternates: { canonical: "https://www.bloxquiz.gg/leaderboard" },
};

async function getCurrentSeason() {
  const { data } = await supabaseAdmin
    .from("seasons")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fallback to most recent if no active season
  if (!data) {
    const { data: fallback } = await supabaseAdmin
      .from("seasons")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    return fallback;
  }

  return data;
}

async function getAllTimeLeaderboard() {
  const { data } = await supabaseAdmin
    .from("users")
    .select("id, username, xp, streak, badges")
    .order("xp", { ascending: false })
    .limit(50);

  return (data || []).map((u, i) => ({
    rank: i + 1,
    user_id: u.id,
    username: u.username,
    xp: u.xp || 0,
    streak: u.streak || 0,
    badges: u.badges || [],
  }));
}

async function getSeasonLeaderboard(seasonStartDate?: string, seasonEndDate?: string) {
  // Build all YYYY-MM months between start and end date
  const start = new Date(seasonStartDate || new Date().toISOString().substring(0, 7) + "-01");
  const end = new Date(seasonEndDate || new Date().toISOString().substring(0, 7) + "-01");
  const months: string[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor <= end) {
    months.push(cursor.toISOString().substring(0, 7));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  if (months.length === 0) months.push(new Date().toISOString().substring(0, 7));

  const { data, error } = await supabaseAdmin
    .from("scores")
    .select("user_id, weighted_score, score, total_questions, quiz_slug, completed_at")
    .in("month", months)
    .order("completed_at", { ascending: true });

  if (error || !data || data.length === 0) return [];

  const seen = new Set<string>();
  const firstAttempts = data.filter(row => {
    const key = `${row.user_id}:${row.quiz_slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const userMap: Record<string, {
    total_score: number;
    quizzes: number;
    correct: number;
    total_questions: number;
  }> = {};

  for (const row of firstAttempts) {
    if (!userMap[row.user_id]) {
      userMap[row.user_id] = { total_score: 0, quizzes: 0, correct: 0, total_questions: 0 };
    }
    userMap[row.user_id].total_score += row.weighted_score || 0;
    userMap[row.user_id].quizzes += 1;
    userMap[row.user_id].correct += row.score || 0;
    userMap[row.user_id].total_questions += row.total_questions || 0;
  }

  const userIds = Object.keys(userMap);
  if (userIds.length === 0) return [];

  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id, username, streak, is_flagged")
    .in("id", userIds);

  const usersById: Record<string, any> = {};
  for (const u of users || []) usersById[u.id] = u;

  return userIds
    .map(uid => ({
      user_id: uid,
      username: usersById[uid]?.username || "Unknown",
      streak: usersById[uid]?.streak || 0,
      is_flagged: usersById[uid]?.is_flagged || false,
      monthly_score: userMap[uid].total_score,
      quizzes_completed: userMap[uid].quizzes,
      avg_accuracy: userMap[uid].total_questions > 0
        ? Math.round((userMap[uid].correct / userMap[uid].total_questions) * 100)
        : 0,
      qualifies: userMap[uid].quizzes >= 10,
    }))
    .sort((a, b) => b.monthly_score - a.monthly_score)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export default async function LeaderboardPage() {
  const [allTime, currentSeason] = await Promise.all([
    getAllTimeLeaderboard(),
    getCurrentSeason(),
  ]);

  const season = await getSeasonLeaderboard(currentSeason?.start_date, currentSeason?.end_date);

  return (
    <LeaderboardClient
      allTimeLeaderboard={allTime}
      seasonLeaderboard={season}
      seasonClosed={currentSeason?.status === "closed"}
      seasonName={currentSeason?.name || "Q2 2026"}
      seasonEndDate={currentSeason?.end_date}
    />
  );
}