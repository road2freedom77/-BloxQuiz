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

function getBatchSize(): number {
  const roll = Math.random();
  if (roll < 0.50) return 0;
  if (roll < 0.80) return 1;
  if (roll < 0.93) return 2;
  if (roll < 0.98) return 3;
  return 4;
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
  "intro": "A unique 2-3 sentence paragraph about this specific quiz topic. Reference specific game mechanics, items, areas, or lore relevant to ${game} and the ${angle} angle. Do NOT use generic phrases like 'Test your knowledge' or 'Can you get a perfect score'. Write it as if a fan is hyping up another player.",
  "game": "${game}",
  "difficulty": "${difficulty}",
  "angle": "${angle}",
  "faqs": [
    {
      "question": "A specific question about this particular quiz topic",
      "answer": "A detailed 1-2 sentence answer that references specific ${game} content relevant to this quiz"
    }
  ],
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
- Exactly 4 FAQs
- All questions must be about ${game} specifically
- Angle "${angle}" means: ${getAngleDescription(angle)}
- "correct" is the index (0-3) of the correct answer in the "a" array
- Make questions genuinely challenging and accurate
- Vary question difficulty within the quiz
- No duplicate questions
- Title must be unique and specific, not generic
- The intro must reference actual ${game} content like specific items, areas, mechanics, or updates relevant to the "${angle}" angle
- FAQs must be specific to THIS quiz topic, not generic. Each FAQ answer must mention specific ${game} game content. Do NOT use generic answers like "Practice by playing more quizzes". Do NOT include FAQs about number of questions, difficulty level, or whether the quiz is free.
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
      max_tokens: 2500,
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

async function publishOneQuiz(existing: any[]) {
  const { game, angle } = await pickGameAndAngle(existing);

  const quiz = await generateQuiz(game, angle);

  const baseSlug = slugify(quiz.title);
  const { data: existingSlug } = await supabase
    .from("quizzes")
    .select("id")
    .eq("slug", baseSlug)
    .single();

  const slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

  const { error } = await supabase.from("quizzes").insert({
    slug,
    title: quiz.title,
    intro: quiz.intro || null,
    game: quiz.game,
    difficulty: quiz.difficulty,
    angle: quiz.angle,
    questions: quiz.questions,
    faqs: quiz.faqs || null,
    published_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  await supabase.from("cron_logs").insert({
    status: "success",
    game,
    angle,
    quiz_slug: slug,
  });

  existing.push({ game, angle, slug });

  return { slug, game, angle };
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todayCount = await getTodayCount();
  const DAILY_CAP = 15;

  if (todayCount >= DAILY_CAP) {
    return NextResponse.json({ skipped: true, reason: "Daily cap reached", todayCount });
  }

  let batchSize = getBatchSize();
  batchSize = Math.min(batchSize, DAILY_CAP - todayCount);

  if (batchSize === 0) {
    return NextResponse.json({ skipped: true, reason: "Random skip this run", todayCount });
  }

  const existing = await getExistingQuizzes();
  const published: any[] = [];
  const failed: any[] = [];

  for (let i = 0; i < batchSize; i++) {
    try {
      const result = await publishOneQuiz(existing);
      published.push(result);
    } catch (error: any) {
      const { game, angle } = await pickGameAndAngle(existing);
      await supabase.from("cron_logs").insert({
        status: "failed",
        game,
        angle,
        error: error.message,
      });
      failed.push({ error: error.message });
    }
  }

  if (published.length > 0) {
    await fetch("https://www.google.com/ping?sitemap=https://www.bloxquiz.gg/sitemap.xml");
  }

  return NextResponse.json({
    success: true,
    published: published.length,
    failed: failed.length,
    todayTotal: todayCount + published.length,
    quizzes: published,
  });
}