import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const GAMES = [
  "Blox Fruits", "Brookhaven RP", "Adopt Me!", "Tower of Hell",
  "Murder Mystery 2", "Grow a Garden", "Royale High", "Doors",
  "Arsenal", "Anime Fighting Simulator", "Berry Avenue", "Livetopia",
  "Natural Disaster Survival", "Anime Defenders", "Funky Friday", "Kick Off",
  "Bee Swarm Simulator", "Dress to Impress"
];

const DEFAULT_ANGLES = ["Beginner", "Expert", "Lore", "Trading", "Mechanics", "Secrets", "Updates", "Characters"];

const GAME_ANGLES: Record<string, string[]> = {
  "Blox Fruits":              ["Beginner", "Expert", "Lore", "Trading", "Mechanics", "Secrets", "Updates", "Characters"],
  "Brookhaven RP":            ["Beginner", "Expert", "Lore", "Secrets", "Updates", "Characters", "Locations", "Roleplay"],
  "Adopt Me!":                ["Beginner", "Expert", "Lore", "Trading", "Secrets", "Updates", "Characters", "Pets"],
  "Tower of Hell":            ["Beginner", "Expert", "Mechanics", "Secrets", "Updates", "Stages", "Tips", "Modifiers"],
  "Murder Mystery 2":         ["Beginner", "Expert", "Lore", "Trading", "Mechanics", "Secrets", "Updates", "Characters"],
  "Grow a Garden":            ["Beginner", "Expert", "Mechanics", "Secrets", "Updates", "Plants", "Mutations", "Strategy"],
  "Royale High":              ["Beginner", "Expert", "Lore", "Trading", "Secrets", "Updates", "Characters", "Fashion"],
  "Doors":                    ["Beginner", "Expert", "Lore", "Mechanics", "Secrets", "Updates", "Entities", "Survival"],
  "Arsenal":                  ["Beginner", "Expert", "Mechanics", "Secrets", "Updates", "Weapons", "Maps", "Strategy"],
  "Anime Fighting Simulator": ["Beginner", "Expert", "Lore", "Mechanics", "Secrets", "Updates", "Characters", "Training"],
  "Berry Avenue":             ["Beginner", "Expert", "Secrets", "Updates", "Characters", "Locations", "Roleplay", "Jobs"],
  "Livetopia":                ["Beginner", "Expert", "Secrets", "Updates", "Characters", "Locations", "Roleplay", "Jobs"],
  "Natural Disaster Survival":["Beginner", "Expert", "Mechanics", "Secrets", "Updates", "Disasters", "Survival", "Maps"],
  "Anime Defenders":          ["Beginner", "Expert", "Lore", "Mechanics", "Secrets", "Updates", "Characters", "Strategy"],
  "Funky Friday":             ["Beginner", "Expert", "Mechanics", "Secrets", "Updates", "Songs", "Characters", "Ranks"],
  "Kick Off":                 ["Beginner", "Expert", "Mechanics", "Secrets", "Updates", "Strategy", "Teams", "Skills"],
  "Bee Swarm Simulator":      ["Beginner", "Expert", "Lore", "Mechanics", "Secrets", "Updates", "Characters", "Bees"],
  "Dress to Impress":         ["Beginner", "Expert", "Mechanics", "Secrets", "Updates", "Characters", "Fashion", "Themes"],
};

const DIFFICULTIES: Record<string, string> = {
  Beginner: "Easy", Expert: "Hard", Lore: "Medium", Trading: "Medium",
  Mechanics: "Hard", Secrets: "Medium", Updates: "Medium", Characters: "Medium",
  Locations: "Medium", Roleplay: "Easy", Pets: "Medium", Stages: "Medium",
  Tips: "Easy", Modifiers: "Hard", Plants: "Medium", Mutations: "Hard",
  Strategy: "Hard", Fashion: "Medium", Entities: "Hard", Survival: "Hard",
  Weapons: "Medium", Maps: "Medium", Training: "Medium", Jobs: "Easy",
  Disasters: "Hard", Songs: "Medium", Ranks: "Medium", Teams: "Easy",
  Skills: "Hard", Bees: "Medium", Themes: "Medium",
};

const ANGLE_DESCRIPTIONS: Record<string, string> = {
  Beginner:    "basic mechanics, starter items, fundamental gameplay for new players",
  Expert:      "advanced strategies, endgame content, rare items, expert-level knowledge",
  Lore:        "story, characters, world-building, lore and narrative elements",
  Trading:     "item types and categories, trading mechanics, notable item tiers — avoid specific numerical values that change frequently",
  Mechanics:   "combat systems, abilities, game mechanics, technical gameplay",
  Secrets:     "hidden items, Easter eggs, secret locations, tricks and discoveries",
  Updates:     "major named updates, new content additions, significant feature changes — avoid patch-specific numbers",
  Characters:  "NPCs, characters, personalities, and their roles in the game",
  Locations:   "maps, areas, districts, landmarks and hidden spots in the game world",
  Roleplay:    "roleplay scenarios, jobs, social dynamics and creative gameplay",
  Pets:        "pet types, rarities, abilities, aging and care mechanics",
  Stages:      "stage layouts, obstacle types, difficulty progression and completion strategies",
  Tips:        "useful tips, tricks, shortcuts and beginner-friendly advice",
  Modifiers:   "game modifiers, power-ups, rings and special gameplay alterations",
  Plants:      "plant types, growth stages, harvest mechanics and rare crops",
  Mutations:   "rare mutations, special variants, unique drops and mutation triggers",
  Strategy:    "optimal strategies, meta builds, team compositions and winning tactics",
  Fashion:     "outfits, accessories, styles, customization and fashion trends",
  Entities:    "monsters, entities, bosses, their behaviors and how to survive them",
  Survival:    "survival strategies, escape routes, safe zones and defensive play",
  Weapons:     "weapon types, categories, unlocks and combat effectiveness",
  Maps:        "map layouts, key areas, spawn points and navigational knowledge",
  Training:    "training mechanics, stat grinding, zone progression and benchmarks",
  Jobs:        "available jobs, tasks, earning mechanics and job-specific rewards",
  Disasters:   "disaster types, mechanics, survival tips and rare disaster events",
  Songs:       "song catalog, artists, difficulty ratings and notable tracks",
  Ranks:       "rank system, progression, requirements and prestige mechanics",
  Teams:       "team compositions, roles, synergies and team-based strategies",
  Skills:      "skill trees, ability unlocks, power shots and advanced techniques",
  Bees:        "bee types, rarities, abilities, hive synergies and collection strategies",
  Themes:      "outfit themes, judging criteria, theme interpretations and runway strategy",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getAnglesForGame(game: string): string[] {
  return GAME_ANGLES[game] || DEFAULT_ANGLES;
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
  const { data } = await supabase.from("quizzes").select("game, angle, slug");
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
    const angles = getAnglesForGame(game);
    const usedAngles = gameAngles[game];
    const availableAngles = angles.filter(a => !usedAngles.includes(a));
    if (availableAngles.length > 0) {
      const angle = availableAngles[Math.floor(Math.random() * availableAngles.length)];
      return { game, angle };
    }
  }

  const game = GAMES[Math.floor(Math.random() * GAMES.length)];
  const angles = getAnglesForGame(game);
  const angle = angles[Math.floor(Math.random() * angles.length)];
  return { game, angle };
}

async function generateQuiz(game: string, angle: string) {
  const difficulty = DIFFICULTIES[angle] || "Medium";
  const angleDescription = ANGLE_DESCRIPTIONS[angle] || angle;

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

CRITICAL ACCURACY RULES — follow these strictly or the quiz will be rejected:
- Only ask questions about facts you are 100% certain are correct and stable
- NEVER ask about specific numerical values (prices, stats, percentages, drop rates) that change with game updates
- NEVER ask about rankings or "best" items — these change with patches
- NEVER ask about limited-time events or seasonal content unless it is a permanent recurring feature
- PREFER questions about: named items/characters/locations, how mechanics work conceptually, lore and story events, named bosses and their behaviors, core game systems that rarely change
- If you are not fully confident a fact is accurate, replace it with a question you ARE certain about
- Angle "${angle}" means: ${angleDescription}
- Exactly 10 questions, exactly 4 FAQs
- All questions must be about ${game} specifically
- "correct" is the index (0-3) of the correct answer in the "a" array
- No duplicate questions
- Title must be unique and specific, not generic
- FAQs must be specific to THIS quiz topic. Do NOT use generic answers. Do NOT include FAQs about number of questions, difficulty level, or whether the quiz is free.
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

async function factCheckQuiz(quiz: any): Promise<any> {
  const prompt = `You are a Roblox game fact-checker. Review these quiz questions for the game "${quiz.game}" and fix any issues.

For each question, return one of:
- "confident": question and answer are correct and stable
- "rewrite": question is about something uncertain or too patch-dependent — rewrite it with a safer question on the same topic
- "replace": answer is likely wrong — replace with a completely new accurate question about ${quiz.game} (${quiz.angle} angle)

Return ONLY a valid JSON object with this exact structure, no markdown:
{
  "questions": [
    {
      "verdict": "confident" | "rewrite" | "replace",
      "reason": "brief reason if rewrite or replace",
      "q": "final question text",
      "a": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Rules:
- Always return exactly 10 questions
- For "confident" questions, copy them exactly as-is
- For "rewrite" or "replace", write a NEW accurate question you are 100% certain about
- Never ask about specific numerical values that change with patches
- Never ask about "best" or "highest" ranked items
- "correct" is the index (0-3) of the correct answer
- Return ONLY the JSON

Here are the questions to review:
${JSON.stringify(quiz.questions, null, 2)}`;

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
  if (!text) throw new Error("No fact-check response from Claude");

  const clean = text.replace(/```json|```/g, "").trim();
  const checked = JSON.parse(clean);

  if (!checked.questions || checked.questions.length !== 10) {
    throw new Error("Invalid fact-check structure from Claude");
  }

  // Count rewrites/replacements for logging
  const rewrites = checked.questions.filter((q: any) => q.verdict === "rewrite").length;
  const replacements = checked.questions.filter((q: any) => q.verdict === "replace").length;

  // Strip verdict/reason fields, keep only q/a/correct
  const cleanQuestions = checked.questions.map((q: any) => ({
    q: q.q,
    a: q.a,
    correct: q.correct,
  }));

  return { questions: cleanQuestions, rewrites, replacements };
}

async function publishOneQuiz(existing: any[]) {
  const { game, angle } = await pickGameAndAngle(existing);

  // Step 1: Generate
  const quiz = await generateQuiz(game, angle);

  // Step 2: Fact-check and fix
  const { questions: checkedQuestions, rewrites, replacements } = await factCheckQuiz(quiz);
  quiz.questions = checkedQuestions;

  // Step 3: Save as draft
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
    source: "generated",
    status: "draft",
    published_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  await supabase.from("cron_logs").insert({
    status: "success",
    game,
    angle,
    quiz_slug: slug,
    notes: rewrites > 0 || replacements > 0 ? `fact-check: ${rewrites} rewritten, ${replacements} replaced` : "fact-check: all confident",
  });

  existing.push({ game, angle, slug });

  return { slug, game, angle, rewrites, replacements };
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todayCount = await getTodayCount();
  const DAILY_CAP = 5;

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