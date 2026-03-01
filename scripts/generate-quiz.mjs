import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const games = [
  { name: "Blox Fruits", slug: "blox-fruits", topics: "fruits, combat, seas, bosses, quests, NPCs" },
  { name: "Brookhaven RP", slug: "brookhaven", topics: "locations, secrets, vehicles, roleplay scenarios" },
  { name: "Adopt Me!", slug: "adopt-me", topics: "pets, eggs, trading, values, updates" },
  { name: "Tower of Hell", slug: "tower-of-hell", topics: "stages, mechanics, records, sections" },
  { name: "Murder Mystery 2", slug: "murder-mystery-2", topics: "knives, guns, maps, strategies, roles" },
  { name: "Grow a Garden", slug: "grow-a-garden", topics: "plants, seeds, tools, mechanics, harvesting" },
];

async function generateQuiz(game, difficulty = "Medium") {
  console.log(`Generating ${difficulty} quiz for ${game.name}...`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Generate a ${difficulty} difficulty 10-question multiple choice trivia quiz about the Roblox game "${game.name}". 
        
Topics to cover: ${game.topics}

Rules:
- Each question must have exactly 4 answer options
- Only one answer is correct
- Questions should be factually accurate about the actual Roblox game
- Difficulty: ${difficulty} (Easy = basic facts, Medium = intermediate knowledge, Hard = expert level)
- Make questions specific and interesting, not too vague
- Make the title unique and descriptive, not generic

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
  const count = parseInt(process.argv[2]) || 1;
  
  for (let i = 0; i < count; i++) {
    const game = games[Math.floor(Math.random() * games.length)];
    const difficulties = ["Easy", "Medium", "Hard"];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const quiz = await generateQuiz(game, difficulty);

    let slug = quiz.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Handle duplicates
    let finalSlug = slug;
    let counter = 2;
    while (fs.existsSync(path.join(process.cwd(), `app/data/quizzes/${finalSlug}.json`))) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    slug = finalSlug;

    const outputPath = path.join(process.cwd(), `app/data/quizzes/${slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify({ slug, ...quiz }, null, 2));
    
    console.log(`✅ Quiz generated: ${slug}`);
    console.log(`   Title: ${quiz.title}`);
    console.log(`   URL: /quiz/${slug}`);
    
    if (i < count - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

main().catch(console.error);