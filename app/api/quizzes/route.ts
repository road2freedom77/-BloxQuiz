import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { supabaseAdmin } from "../../lib/supabase";

const gameEmojis: Record<string, string> = {
  "Blox Fruits": "⚔️",
  "Brookhaven RP": "🏠",
  "Adopt Me!": "🐾",
  "Tower of Hell": "🗼",
  "Murder Mystery 2": "🔫",
  "Grow a Garden": "🌱",
  "Royale High": "👑",
  "Doors": "🚪",
  "Arsenal": "🎯",
  "Anime Fighting Simulator": "🥊",
  "Berry Avenue": "🍓",
  "Livetopia": "🏖️",
  "Natural Disaster Survival": "🌪️",
  "Anime Defenders": "🐉",
  "Funky Friday": "🎵",
  "Kick Off": "⚽",
  "Bee Swarm Simulator": "🐝",
  "Dress to Impress": "👗",
  "Fisch": "🎣",
};

const gameThumbs: Record<string, string> = {
  "Blox Fruits": "linear-gradient(135deg, #1a0a2e, #3d1a5c)",
  "Brookhaven RP": "linear-gradient(135deg, #0a1628, #1a3a5c)",
  "Adopt Me!": "linear-gradient(135deg, #2a1a0a, #5c3a1a)",
  "Tower of Hell": "linear-gradient(135deg, #0a1a0a, #1a3a1a)",
  "Murder Mystery 2": "linear-gradient(135deg, #1a0a0a, #3a1a1a)",
  "Grow a Garden": "linear-gradient(135deg, #0a1a0a, #1a3a1a)",
  "Royale High": "linear-gradient(135deg, #2a0a2e, #5c1a5c)",
  "Doors": "linear-gradient(135deg, #1a1a0a, #3a3a1a)",
  "Arsenal": "linear-gradient(135deg, #1a0a0a, #4a1a1a)",
  "Anime Fighting Simulator": "linear-gradient(135deg, #0a0a2e, #1a1a5c)",
  "Berry Avenue": "linear-gradient(135deg, #2a0a1a, #5c1a3a)",
  "Livetopia": "linear-gradient(135deg, #0a1a2a, #1a3a5c)",
  "Natural Disaster Survival": "linear-gradient(135deg, #1a1a0a, #4a3a0a)",
  "Anime Defenders": "linear-gradient(135deg, #0a0a1a, #1a1a4a)",
  "Funky Friday": "linear-gradient(135deg, #1a0a2a, #4a1a5c)",
  "Kick Off": "linear-gradient(135deg, #0a1a0a, #1a4a1a)",
  "Bee Swarm Simulator": "linear-gradient(135deg, #1a1400, #3a2e00)",
  "Dress to Impress": "linear-gradient(135deg, #2a0a1e, #5c1a4a)",
  "Fisch": "linear-gradient(135deg, #0a1a2a, #0a3a5c)",
};

async function getThumbnailsByName(): Promise<Record<string, string>> {
  try {
    const { data } = await supabaseAdmin
      .from("roblox_games")
      .select("name, thumbnail_url")
      .eq("is_tracked", true);
    if (!data) return {};
    const map: Record<string, string> = {};
    for (const g of data) {
      if (g.thumbnail_url) map[g.name] = g.thumbnail_url;
    }
    return map;
  } catch {
    return {};
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "200");
  const game = searchParams.get("game") || null;

  const thumbnails = await getThumbnailsByName();

  function getThumb(gameName: string): string {
    return thumbnails[gameName]
      ? `url(${thumbnails[gameName]})`
      : gameThumbs[gameName] || "linear-gradient(135deg, #1a1a2e, #3d1a5c)";
  }

  try {
    let query = supabase
      .from("quizzes")
      .select("slug, title, game, difficulty, questions, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (game) {
      query = query.ilike("game", `%${game}%`);
    }

    const { data } = await query.limit(limit);

    const quizzes = (data ?? []).map(q => ({
      slug: q.slug,
      title: q.title,
      game: q.game,
      difficulty: q.difficulty,
      questions: Array.isArray(q.questions) ? q.questions.length : 10,
      emoji: gameEmojis[q.game] || "🎮",
      thumb: getThumb(q.game),
      thumbIsImage: !!thumbnails[q.game],
      published_at: q.published_at,
    }));

    return NextResponse.json({ quizzes });
  } catch {
    return NextResponse.json({ quizzes: [] });
  }
}