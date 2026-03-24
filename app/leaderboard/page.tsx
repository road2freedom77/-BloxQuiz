import { supabaseAdmin } from "../lib/supabase";
import LeaderboardClient from "./LeaderboardClient";

export const revalidate = 0;

export const metadata = {
  title: "Leaderboard — Top Roblox Quiz Players | BloxQuiz",
  description: "See the top Roblox quiz players on BloxQuiz.gg. Compete for Roblox gift cards up to $20. Season 1 active now — top 3 players win real prizes!",
  alternates: { canonical: "https://www.bloxquiz.gg/leaderboard" },
};

async function getCurrentSeason() {
  const { data } = await supabaseAdmin
    .from("seasons")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(1)
    .single();
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

async function getSeasonLeaderboard() {
  const currentMonth = new Date().toISOString().substring(0, 7);

  const { data, error } = await supabaseAdmin
    .from("scores")
    .select("user_id, weighted_score, score, total_questions, quiz_slug, completed_at")
    .eq("month", currentMonth)
    .order("completed_at", { ascending: true }); // oldest first for dedup

  if (error || !data || data.length === 0) return [];

  // Deduplicate — keep only first attempt per user+quiz combo
  const seen = new Set<string>();
  const firstAttempts = data.filter(row => {
    const key = `${row.user_id}:${row.quiz_slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Aggregate per user
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

  // Fetch user details
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
  const [allTime, season, currentSeason] = await Promise.all([
    getAllTimeLeaderboard(),
    getSeasonLeaderboard(),
    getCurrentSeason(),
  ]);

  return (
    <LeaderboardClient
      allTimeLeaderboard={allTime}
      seasonLeaderboard={season}
      seasonClosed={currentSeason?.status === "closed"}
      seasonName={currentSeason?.name || "Season 1"}
    />
  );
}