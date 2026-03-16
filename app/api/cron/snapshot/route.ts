import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: games, error: gamesError } = await supabase
      .from("roblox_games")
      .select("universe_id")
      .eq("is_tracked", true);

    if (gamesError || !games?.length) {
      return NextResponse.json({ error: "No games found" }, { status: 500 });
    }

    const universeIds = games.map((g) => g.universe_id);

    const batches = [];
    for (let i = 0; i < universeIds.length; i += 50) {
      batches.push(universeIds.slice(i, i + 50));
    }

    let totalSnapshots = 0;

    for (const batch of batches) {
      const ids = batch.join(",");
      const res = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${ids}`
      );
      const data = await res.json();

      if (!data.data?.length) continue;

      const snapshots = data.data.map((g: any) => ({
        universe_id: g.id,
        concurrent_players: g.playing,
        total_visits: g.visits,
        favorites: g.favoritedCount,
        likes: g.likes ?? 0,
        dislikes: g.dislikes ?? 0,
      }));

      await supabase.from("game_snapshots").insert(snapshots);

      for (const g of data.data) {
        await supabase
          .from("roblox_games")
          .update({
            current_players: g.playing,
            total_visits: g.visits,
            favorites: g.favoritedCount,
            likes: g.likes ?? 0,
            dislikes: g.dislikes ?? 0,
            last_updated: new Date().toISOString(),
          })
          .eq("universe_id", g.id);
      }

      totalSnapshots += snapshots.length;

      if (batches.length > 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    return NextResponse.json({
      success: true,
      snapshots: totalSnapshots,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Snapshot failed" }, { status: 500 });
  }
}