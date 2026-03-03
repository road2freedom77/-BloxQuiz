import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const GAMES = [
  "Blox Fruits", "Brookhaven RP", "Adopt Me!", "Tower of Hell",
  "Murder Mystery 2", "Grow a Garden", "Royale High", "Doors",
  "Arsenal", "Anime Fighting Simulator", "Berry Avenue", "Livetopia",
  "Natural Disaster Survival", "Anime Defenders", "Funky Friday", "Kick Off"
];

const ANGLES = ["Beginner", "Expert", "Lore", "Trading", "Mechanics", "Secrets", "Updates"];

const DIFFICULTIES: Record<string, string> = {
  Beginner: "Easy",
  Expert: "Hard",
  Lore: "Medium",
  Trading: "Medium",
  Mechanics: "Hard",
  Secrets: "Medium",
  Updates: "Medium",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getAngleDescription(angle: string) {
  const descriptions: Record<string, string> = {
    Beginner: "basic mechanics, starter items, fundamental gameplay for new players",
    Expert: "advanced strategies, endgame content, rare items, expert-level knowledge",
    Lore: "story, characters, world-building, lore and narrative elements",
    Trading: "item values, trading strategies, rare items, economy and market knowledge",
    Mechanics: "combat systems, abilities, game mechanics, technical gameplay",
    Secrets: "hidden items, Easter eggs, secret locations, tricks and discoveries",
    Updates: "recent additions, new content, latest features and changes",
  };
  return descriptions[angle] || angle;
}

async function getTodayCount() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("cron_logs")
    .select("*", { count: "exact", head: true })
    .eq("status", "success")
    .gte("created_at", today.toISOString());
  return count || 0;
}

async function getExistingQuizzes() {
  const { data } = await supabase
    .from("quizzes")
    .select("game, angle, slug");
  return data || [];
}

async function pickGameAndAngle(existing: any[]) {
  const gameCounts: Record<string, number> = {};
  const gameAngles: Record<string, string[]> = {};

  for (const game of GAMES) {
    gameCounts[game] = 0;
    gameAngles[game] = [];
  }

  for (const q of existing) {
    if (gameCounts[q.game] !== undefined) {
      gameCounts[q.game]++;
      if (q.angle) gameAngles[q.game].push(q.angle);
    }
  }

  const sortedGames = [...GAMES].sort((a, b) => gameCounts[a] - gameCounts[b]);

  for (const game of sortedGames) {
    const usedAngles = gameAngles[game];
    const availableAngles = ANGLES.filter(a => !usedAngles.includes(a));
    if (availableAngles.length > 0) {
      const angle = availableAngles[Math.floor(Math.random() * availableAngles.length)];
      return { game, angle };
    }
  }

  const game = GAMES[Math.floor(Math.random() * GAMES.length)];
  const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
  return { game, angle };
}

async function generateQuiz(game: string, angle: string) {
  const difficulty = DIFFICULTIES[angle];

  const prompt = `Generate a Roblox ${game} quiz with a "${angle}" angle.

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "title": "A specific engaging quiz title about ${game} (${angle} angle)",
  "game": "${game}",
  "difficulty": "${difficulty}",
  "angle": "${angle}",
  "questions": [
    {
      "q": "Question text here?",
      "a": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Rules:
- Exactly 10 questions
- All questions must be about ${game} specifically
- Angle "${angle}" means: ${getAngleDescription(angle)}
- "correct" is the index (0-3) of the correct answer in the "a" array
- Make questions genuinely challenging and accurate
- Vary question difficulty within the quiz
- No duplicate questions
- Title must be unique and specific, not generic
- Return ONLY the JSON, nothing else`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("No response from Claude");

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  if (!parsed.title || !parsed.questions || parsed.questions.length !== 10) {
    throw new Error("Invalid quiz structure from Claude");
  }

  return parsed;
}

export async function GET(req: Request) {
  // Verify secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check daily limit (max 2 per day)
  const todayCount = await getTodayCount();
  if (todayCount >= 2) {
    return NextResponse.json({ skipped: true, reason: "Daily limit reached" });
  }

  // Random roll — 25% chance to generate on any given hour
  const roll = Math.random();
  if (roll > 1) {
    return NextResponse.json({ skipped: true, reason: "Random skip", roll });
  }

  // Pick game and angle
  const existing = await getExistingQuizzes();
  const { game, angle } = await pickGameAndAngle(existing);

  try {
    const quiz = await generateQuiz(game, angle);

    // Create clean slug, only add suffix if duplicate
    const baseSlug = slugify(quiz.title);
    const { data: existingSlug } = await supabase
      .from("quizzes")
      .select("id")
      .eq("slug", baseSlug)
      .single();

    const slug = existingSlug ? `${baseSlug}-2` : baseSlug;

    // Save to Supabase
    const { error } = await supabase.from("quizzes").insert({
      slug,
      title: quiz.title,
      game: quiz.game,
      difficulty: quiz.difficulty,
      angle: quiz.angle,
      questions: quiz.questions,
    });

    if (error) throw new Error(error.message);

    // Log success
    await supabase.from("cron_logs").insert({
      status: "success",
      game,
      angle,
      quiz_slug: slug,
    });

    // Ping Google sitemap
    await fetch("https://www.google.com/ping?sitemap=https://www.bloxquiz.gg/sitemap.xml");

    return NextResponse.json({ success: true, slug, game, angle });

  } catch (error: any) {
    await supabase.from("cron_logs").insert({
      status: "failed",
      game,
      angle,
      error: error.message,
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}