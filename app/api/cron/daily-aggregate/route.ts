import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split("T")[0];

    const { data: games } = await supabase
      .from("roblox_games")
      .select("universe_id")
      .eq("is_tracked", true);

    if (!games?.length) {
      return NextResponse.json({ error: "No games found" }, { status: 500 });
    }

    let aggregated = 0;

    for (const game of games) {
      const { data: snapshots } = await supabase
        .from("game_snapshots")
        .select("concurrent_players, total_visits, favorites")
        .eq("universe_id", game.universe_id)
        .gte("captured_at", `${date}T00:00:00Z`)
        .lt("captured_at", `${date}T23:59:59Z`);

      if (!snapshots?.length) continue;

      const players = snapshots.map((s) => s.concurrent_players ?? 0);
      const visits = snapshots.map((s) => s.total_visits ?? 0);
      const favs = snapshots.map((s) => s.favorites ?? 0);

      const avg_players = Math.round(
        players.reduce((a, b) => a + b, 0) / players.length
      );
      const peak_players = Math.max(...players);
      const min_players = Math.min(...players);
      const total_visits_delta = Math.max(...visits) - Math.min(...visits);
      const favorites_delta = Math.max(...favs) - Math.min(...favs);

      await supabase.from("game_daily_stats").upsert({
        universe_id: game.universe_id,
        date,
        avg_players,
        peak_players,
        min_players,
        total_visits_delta,
        favorites_delta,
      });

      aggregated++;
    }

    return NextResponse.json({
      success: true,
      aggregated,
      date,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Aggregation failed" }, { status: 500 });
  }
}