import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GameRecord {
  universe_id: number;
  slug: string;
  name: string;
  genre: string | null;
  current_players: number | null;
  total_visits: number | null;
  favorites: number | null;
  likes: number | null;
  dislikes: number | null;
}

interface GeneratedContent {
  intro: string;
  faqs: { q: string; a: string }[];
  meta_title: string;
  meta_description: string;
}

// ---------------------------------------------------------------------------
// Claude content generation
// ---------------------------------------------------------------------------

async function generateContent(game: GameRecord): Promise<GeneratedContent> {
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  const approvalRate =
    game.likes && game.dislikes && game.likes + game.dislikes > 0
      ? `${((game.likes / (game.likes + game.dislikes)) * 100).toFixed(1)}%`
      : null;

  function fmt(n: number | null): string {
    if (!n) return "millions of";
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
    return n.toLocaleString();
  }

  const prompt = `You are writing SEO content for BloxQuiz.gg, a Roblox trivia site. Generate content for the stats page of the Roblox game "${game.name}".

Current stats:
- Concurrent players right now: ${fmt(game.current_players)}
- Total all-time visits: ${fmt(game.total_visits)}
- Favorites: ${fmt(game.favorites)}
${approvalRate ? `- Approval rating: ${approvalRate}` : ""}
- Genre: ${game.genre ?? "unknown"}
- Current month: ${month}

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "intro": "A 2-3 sentence Quick Answer paragraph. Must include specific stats (player count, total visits). Use definitive language. Example format: '[Game] currently has [X] active players and [Y] total visits, making it one of the most popular Roblox games. [One sentence about what the game is]. BloxQuiz tracks [Game] player counts hourly so you always have the latest data.'",
  "faqs": [
    { "q": "How many people play [Game] right now?", "a": "Answer using the stats above with specific numbers." },
    { "q": "How many total visits does [Game] have?", "a": "Answer using the stats above." },
    { "q": "Is [Game] still popular in ${month}?", "a": "Answer referencing current player count and ranking." },
    { "q": "How often is [Game] player count updated on BloxQuiz?", "a": "Player counts are updated every hour via the Roblox API, so the data on this page is never more than 60 minutes old." }
  ],
  "meta_title": "${game.name} Player Count (${month}) — Live Stats | BloxQuiz",
  "meta_description": "Live ${game.name} player count: [X] playing now, [Y] total visits. Historical charts and rankings updated hourly. | BloxQuiz"
}

Rules:
- intro must mention specific numbers from the stats above
- intro must be 2-3 sentences, definitive tone, no fluff
- All 4 FAQs must have specific answers referencing the actual stats
- meta_description must be under 160 characters
- meta_title must be under 70 characters
- Return ONLY the JSON, nothing else`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("No response from Claude");

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  if (!parsed.intro || !parsed.faqs || parsed.faqs.length !== 4 || !parsed.meta_title || !parsed.meta_description) {
    throw new Error("Invalid content structure from Claude");
  }

  return parsed as GeneratedContent;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find games missing content
  const { data: games, error } = await supabase
    .from("roblox_games")
    .select("universe_id, slug, name, genre, current_players, total_visits, favorites, likes, dislikes")
    .eq("is_tracked", true)
    .or("intro.is.null,faqs.is.null,meta_title.is.null");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!games?.length) {
    return NextResponse.json({ success: true, message: "All games already have content", generated: 0 });
  }

  const generated: string[] = [];
  const failed: { name: string; error: string }[] = [];

  for (const game of games as GameRecord[]) {
    try {
      const content = await generateContent(game);

      const { error: updateError } = await supabase
        .from("roblox_games")
        .update({
          intro: content.intro,
          faqs: content.faqs,
          meta_title: content.meta_title,
          meta_description: content.meta_description,
        })
        .eq("universe_id", game.universe_id);

      if (updateError) throw new Error(updateError.message);

      generated.push(game.name);
      console.log(`[generate-stats-content] ✅ ${game.name}`);

      // Small delay to respect API rate limits
      await new Promise((r) => setTimeout(r, 500));
    } catch (err: any) {
      console.error(`[generate-stats-content] ❌ ${game.name}:`, err.message);
      failed.push({ name: game.name, error: err.message });
    }
  }

  return NextResponse.json({
    success: true,
    generated: generated.length,
    failed: failed.length,
    games: generated,
    errors: failed,
  });
}