import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "../../lib/supabase";
import PublicProfileClient from "./PublicProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `${username}'s Profile | BloxQuiz`,
    description: `Check out ${username}'s Roblox quiz stats on BloxQuiz.gg!`,
  };
}

async function getCurrentSeason() {
  const { data } = await supabase
    .from("seasons")
    .select("*")
    .eq("status", "active")
    .order("start_date", { ascending: false })
    .limit(1)
    .single();
  return data || null;
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { userId } = await auth();

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .order("xp", { ascending: false })
    .limit(1)
    .single();

  if (!userData) notFound();

  const isOwner = !!userId && userId === userData.id;

  const [scores, allUsers, currentSeason] = await Promise.all([
    supabase
      .from("scores")
      .select("*")
      .eq("user_id", userData.id)
      .order("completed_at", { ascending: false })
      .limit(10)
      .then(({ data }) => data || []),
    supabase
      .from("users")
      .select("id, xp")
      .order("xp", { ascending: false })
      .then(({ data }) => data || []),
    getCurrentSeason(),
  ]);

  const rank = allUsers.findIndex(u => u.id === userData.id) + 1 || null;

  // Use active season's start_date month
  const seasonMonth = currentSeason?.start_date
    ? currentSeason.start_date.substring(0, 7)
    : new Date().toISOString().substring(0, 7);

  const { data: monthlyScores } = await supabase
    .from("scores")
    .select("user_id, weighted_score")
    .eq("month", seasonMonth)
    .eq("is_first_attempt", true);

  let seasonRank: number | null = null;
  let seasonScore = 0;
  let seasonQuizzes = 0;

  if (monthlyScores) {
    const userTotals: Record<string, { score: number, quizzes: number }> = {};
    for (const row of monthlyScores) {
      if (!userTotals[row.user_id]) userTotals[row.user_id] = { score: 0, quizzes: 0 };
      userTotals[row.user_id].score += row.weighted_score || 0;
      userTotals[row.user_id].quizzes += 1;
    }
    seasonScore = userTotals[userData.id]?.score || 0;
    seasonQuizzes = userTotals[userData.id]?.quizzes || 0;
    const sorted = Object.entries(userTotals).sort((a, b) => b[1].score - a[1].score);
    const idx = sorted.findIndex(([uid]) => uid === userData.id);
    seasonRank = idx >= 0 ? idx + 1 : null;
  }

  let prizeData = null;
  if (isOwner) {
    const { data } = await supabase
      .from("season_results")
      .select("rank, reward_status")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    prizeData = data || null;
  }

  return (
    <PublicProfileClient
      userData={userData}
      scores={scores}
      rank={rank}
      seasonRank={seasonRank}
      seasonScore={seasonScore}
      seasonQuizzes={seasonQuizzes}
      prizeData={prizeData}
      isOwner={isOwner}
      currentSeason={currentSeason}
    />
  );
}