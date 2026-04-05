import { supabaseAdmin } from "../lib/supabase";
import GameFinderClient from "./GameFinderClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "What Roblox Game Should I Play? — Game Finder 2026 | BloxQuiz",
  description: "Not sure what to play on Roblox? Answer a few quick questions and get personalized game recommendations based on your vibe, with live player counts and trending games.",
  alternates: { canonical: "https://www.bloxquiz.gg/what-roblox-game-should-i-play" },
  openGraph: {
    title: "What Roblox Game Should I Play? | BloxQuiz",
    description: "Get personalized Roblox game recommendations based on your mood and playstyle. Updated with live player counts.",
    url: "https://www.bloxquiz.gg/what-roblox-game-should-i-play",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export interface GameEntry {
  slug: string;
  name: string;
  emoji: string | null;
  genre: string;
  current_players: number | null;
  total_visits: number | null;
  thumbnail_url: string | null;
  trend_label: string | null;
}

export default async function WhatRobloxGameShouldIPlay() {
  const { data } = await supabaseAdmin
    .from("roblox_games")
    .select("slug, name, emoji, genre, current_players, total_visits, thumbnail_url")
    .eq("is_tracked", true)
    .not("genre", "is", null)
    .order("current_players", { ascending: false, nullsFirst: false });

  const games = (data ?? []) as Omit<GameEntry, "trend_label">[];

  // Fetch trend labels from insights view
  const { data: insights } = await supabaseAdmin
    .from("game_history_insights_14d")
    .select("slug, trend_label");

  const trendMap: Record<string, string | null> = {};
  (insights ?? []).forEach((r: { slug: string; trend_label: string | null }) => {
    trendMap[r.slug] = r.trend_label;
  });

  const gamesWithTrend: GameEntry[] = games.map((g) => ({
    ...g,
    genre: g.genre as string,
    trend_label: trendMap[g.slug] ?? null,
  }));

  return <GameFinderClient games={gamesWithTrend} />;
}