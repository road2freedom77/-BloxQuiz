import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { supabase, supabaseAdmin } from "../../lib/supabase";
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

async function getFollowedGames(userId: string) {
  const { data: follows } = await supabaseAdmin
    .from("game_follows")
    .select("game_slug, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!follows || follows.length === 0) return [];

  const slugs = follows.map(f => f.game_slug);

  const [gamesRes, codesRes, insightsRes, changeLogRes] = await Promise.all([
    supabaseAdmin
      .from("code_games")
      .select("slug, game, icon")
      .in("slug", slugs),
    supabaseAdmin
      .from("codes")
      .select("slug, active")
      .in("slug", slugs)
      .eq("active", true),
    supabaseAdmin
      .from("game_history_insights_14d")
      .select("slug, trend_label, trend_pct_7d")
      .in("slug", slugs),
    supabaseAdmin
      .from("code_change_log")
      .select("game_slug, changed_at")
      .in("game_slug", slugs)
      .order("changed_at", { ascending: false }),
  ]);

  // Active code counts
  const codeCountBySlug: Record<string, number> = {};
  for (const c of codesRes.data || []) {
    codeCountBySlug[c.slug] = (codeCountBySlug[c.slug] || 0) + 1;
  }

  // Game name + icon
  const gamesBySlug: Record<string, any> = {};
  for (const g of gamesRes.data || []) gamesBySlug[g.slug] = g;

  // Trend data
  const trendBySlug: Record<string, { trend_label: string | null; trend_pct_7d: number | null }> = {};
  for (const i of insightsRes.data || []) {
    trendBySlug[i.slug] = { trend_label: i.trend_label, trend_pct_7d: i.trend_pct_7d };
  }

  // Most recent code change per game
  const lastCodeBySlug: Record<string, string | null> = {};
  for (const row of changeLogRes.data || []) {
    if (!lastCodeBySlug[row.game_slug]) {
      lastCodeBySlug[row.game_slug] = row.changed_at;
    }
  }

  return slugs.map(slug => ({
    slug,
    game: gamesBySlug[slug]?.game || slug,
    icon: gamesBySlug[slug]?.icon || "🎮",
    activeCodes: codeCountBySlug[slug] || 0,
    trendLabel: trendBySlug[slug]?.trend_label ?? null,
    trendPct: trendBySlug[slug]?.trend_pct_7d ?? null,
    lastCodeAt: lastCodeBySlug[slug] ?? null,
  }));
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

  const [scores, allUsers, currentSeason, followedGames] = await Promise.all([
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
    isOwner && userId ? getFollowedGames(userId) : Promise.resolve([]),
  ]);

  const rank = allUsers.findIndex(u => u.id === userData.id) + 1 || null;

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
      followedGames={followedGames}
    />
  );
}