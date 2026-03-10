import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const GAMES = ["Bee Swarm Simulator", "Dress to Impress"];
const ANGLES = ["Expert", "Lore", "Trading", "Mechanics", "Secrets", "Updates", "Characters"];
const DIFFICULTIES = {
  Expert: "Hard", Lore: "Medium", Trading: "Medium",
  Mechanics: "Hard", Secrets: "Medium", Updates: "Medium", Characters: "Medium",
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getAngleDescription(angle) {
  const descriptions = {
    Beginner: "basic mechanics, starter items, fundamental gameplay for new players",
    Expert: "advanced strategies, endgame content, rare items, expert-level knowledge",
    Lore: "story, characters, world-building, lore and narrative elements",
    Trading: "item values, trading strategies, rare items, economy and market knowledge",
    Mechanics: "combat systems, abilities, game mechanics, technical gameplay",
    Secrets: "hidden items, Easter eggs, secret locations, tricks and discoveries",
    Characters: "NPCs, characters, personalities, and their roles in the game",
  };
  return descriptions[angle] || angle;
}

async function generateQuiz(game, angle) {
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

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content?.[0]?.text;
  if (!text) throw new Error("No response from Claude");

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  if (!parsed.title || !parsed.questions || parsed.questions.length !== 10) {
    throw new Error("Invalid quiz structure from Claude");
  }

  return parsed;
}

async function publishQuiz(game, angle) {
  console.log(`  Generating: ${game} — ${angle}...`);
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

  console.log(`  ✅ Published: ${quiz.title} (${slug})`);
  return slug;
}

async function main() {
  console.log("🚀 Generating quizzes for new games...\n");

  for (const game of GAMES) {
    console.log(`\n🎮 ${game}`);
    for (const angle of ANGLES) {
      try {
        await publishQuiz(game, angle);
      } catch (err) {
        console.error(`  ❌ Failed ${game} — ${angle}:`, err.message);
        await supabase.from("cron_logs").insert({
          status: "failed",
          game,
          angle,
          error: err.message,
        });
      }
    }
  }

  console.log("\n✅ Done! 16 quizzes generated (8 per game). Total: 8 + 1 existing = ~9 per game, hitting 15 with cron.");

  // Ping Google sitemap
  await fetch("https://www.google.com/ping?sitemap=https://www.bloxquiz.gg/sitemap.xml");
  console.log("📡 Google sitemap pinged.");
}

main();
