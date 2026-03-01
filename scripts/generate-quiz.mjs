import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const games = [
  { name: "Blox Fruits", slug: "blox-fruits", topics: "fruits, combat, seas, bosses, quests, NPCs, awakening, races, fighting styles" },
  { name: "Brookhaven RP", slug: "brookhaven", topics: "locations, secrets, vehicles, roleplay scenarios, houses, jobs, hidden areas" },
  { name: "Adopt Me!", slug: "adopt-me", topics: "pets, eggs, trading, values, updates, neon pets, legendary pets, potions" },
  { name: "Tower of Hell", slug: "tower-of-hell", topics: "stages, mechanics, records, sections, obstacles, modifiers, rings" },
  { name: "Murder Mystery 2", slug: "murder-mystery-2", topics: "knives, guns, maps, strategies, roles, godly weapons, trading, seasons" },
  { name: "Grow a Garden", slug: "grow-a-garden", topics: "plants, seeds, tools, mechanics, harvesting, rare crops, fertilizer, seasons" },
];

function getExistingQuizzes() {
  const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
  const existing = [];
  try {
    const files = fs.readdirSync(quizzesDir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      existing.push({ title: content.title, game: content.game });
    }
  } catch (e) {}
  return existing;
}

async function generateQuiz(game, difficulty, existingQuizzes) {
  console.log(`Generating ${difficulty} quiz for ${game.name}...`);

  const existingForGame = existingQuizzes
    .filter(q => q.game === game.name)
    .map(q => q.title);

  const avoidText = existingForGame.length > 0
    ? `\n\nIMPORTANT: These quiz titles already exist for ${game.name} — do NOT repeat the same topics:\n${existingForGame.map(t => `- ${t}`).join("\n")}`
    : "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Generate a ${difficulty} difficulty 10-question multiple choice trivia quiz about the Roblox game "${game.name}".

Topics to cover: ${game.topics}${avoidText}

Rules:
- Each question must have exactly 4 answer options
- Only one answer is correct
- Questions should be factually accurate about the actual Roblox game
- Difficulty: ${difficulty} (Easy = basic facts, Medium = intermediate knowledge, Hard = expert level)
- Make questions specific and interesting, not too vague
- Make the title unique and descriptive, not generic
- Focus on a specific subtopic or angle to differentiate from existing quizzes

Respond with ONLY a valid JSON object in this exact format, no other text:
{
  "title": "Quiz title here",
  "game": "${game.name}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "q": "Question text here?",
      "a": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

The "correct" field is the index (0-3) of the correct answer in the "a" array.`
      }
    ]
  });

  const text = response.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function main() {
  const existingQuizzes = getExistingQuizzes();
  console.log(`Found ${existingQuizzes.length} existing quizzes — avoiding duplicates...\n`);

  const difficulties = ["Easy", "Medium", "Hard"];

  for (const game of games) {
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const quiz = await generateQuiz(game, difficulty, existingQuizzes);

    let slug = quiz.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Handle duplicate slugs
    let finalSlug = slug;
    let counter = 2;
    while (fs.existsSync(path.join(process.cwd(), `app/data/quizzes/${finalSlug}.json`))) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    slug = finalSlug;

    const outputPath = path.join(process.cwd(), `app/data/quizzes/${slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify({ slug, ...quiz }, null, 2));

    // Add to existing list so next game in loop avoids same topics
    existingQuizzes.push({ title: quiz.title, game: quiz.game });

    console.log(`✅ ${quiz.game}: ${quiz.title}`);
    console.log(`   Difficulty: ${difficulty} | URL: /quiz/${slug}\n`);

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`🎉 Done! Generated 6 quizzes, one per game.`);
}

main().catch(console.error);