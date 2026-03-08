import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "../../lib/supabase";

const STATIC_QUIZZES: Record<string, any> = {
  "blox-fruits-ultimate": {
    title: "Ultimate Blox Fruits Expert Quiz",
    game: "Blox Fruits",
    difficulty: "Hard",
    angle: "Expert",
    questions: [
      { q: "Which Blox Fruits fruit is considered the rarest Mythical in the game?", a: ["Kitsune", "Dragon", "Leopard", "T-Rex"], correct: 0 },
      { q: "What level do you need to reach to enter the Second Sea in Blox Fruits?", a: ["Level 500", "Level 700", "Level 1000", "Level 1500"], correct: 1 },
      { q: "Which NPC gives you the Race Awakening quest in Blox Fruits?", a: ["Arowe", "The Gorilla King", "Phoeyu", "Tort"], correct: 0 },
      { q: "What is the maximum level cap in Blox Fruits as of 2025?", a: ["2400", "2550", "2700", "2850"], correct: 2 },
      { q: "Which fighting style requires fragments to unlock?", a: ["Superhuman", "Electric Claw", "Dragon Talon", "Sharkman Karate"], correct: 2 },
      { q: "Which Roblox game holds the record for most visits of all time?", a: ["Adopt Me!", "Blox Fruits", "Brookhaven RP", "Tower of Hell"], correct: 2 },
      { q: "What year was Roblox officially launched to the public?", a: ["2004", "2006", "2008", "2010"], correct: 1 },
      { q: "Which Adopt Me! pet was the first ever Legendary?", a: ["Shadow Dragon", "Frost Dragon", "Blue Dog", "Pink Cat"], correct: 2 },
      { q: "How many Robux does a $10 USD purchase give you?", a: ["400", "800", "1000", "1700"], correct: 1 },
      { q: "In Brookhaven, what's the secret code to access the hidden bunker?", a: ["There is no code", "4321", "0000", "1234"], correct: 0 },
    ]
  },
  "brookhaven-secrets": {
    title: "Brookhaven Secrets You Didn't Know",
    game: "Brookhaven",
    difficulty: "Easy",
    angle: "Secrets",
    questions: [
      { q: "What is the name of the hospital in Brookhaven?", a: ["Brookhaven Hospital", "City Medical Center", "St. Mary's", "General Hospital"], correct: 0 },
      { q: "How many garages are in Brookhaven?", a: ["1", "2", "3", "4"], correct: 1 },
      { q: "Which vehicle is the fastest in Brookhaven?", a: ["Sports Car", "Motorcycle", "Supercar", "Truck"], correct: 2 },
      { q: "What color is the Brookhaven police car?", a: ["Blue and white", "Black and white", "All black", "All white"], correct: 1 },
      { q: "Which building has a secret underground room?", a: ["The Bank", "The School", "The Church", "The Hospital"], correct: 0 },
      { q: "What is the maximum number of players in a Brookhaven server?", a: ["10", "15", "20", "25"], correct: 2 },
      { q: "Which item lets you fly in Brookhaven?", a: ["Jetpack", "Wings", "Balloon", "Hoverboard"], correct: 0 },
      { q: "What year was Brookhaven RP released?", a: ["2018", "2019", "2020", "2021"], correct: 2 },
      { q: "Who created Brookhaven RP?", a: ["Wolfpaq", "Badimo", "Adopt Me Team", "Roblox Corp"], correct: 0 },
      { q: "What is the name of the school in Brookhaven?", a: ["Brookhaven High", "Roblox Academy", "City School", "Brookhaven School"], correct: 3 },
    ]
  },
  "adopt-me-pets": {
    title: "Name That Pet! — Adopt Me Edition",
    game: "Adopt Me!",
    difficulty: "Medium",
    angle: "Beginner",
    questions: [
      { q: "Which pet was available in the very first Adopt Me egg?", a: ["Dog", "Cat", "Unicorn", "Dragon"], correct: 0 },
      { q: "What is the rarest pet in Adopt Me?", a: ["Shadow Dragon", "Frost Dragon", "Bat Dragon", "Evil Unicorn"], correct: 0 },
      { q: "How many eggs are needed to hatch a legendary in the Royal Egg?", a: ["1", "It's random", "5", "10"], correct: 1 },
      { q: "Which pet glows in the dark?", a: ["Neon Pet", "Shadow Dragon", "Ghost Dragon", "All of the above"], correct: 3 },
      { q: "What currency is used in Adopt Me?", a: ["Robux", "Bucks", "Coins", "Stars"], correct: 1 },
      { q: "Which pet can be obtained from the Farm Egg?", a: ["Cow", "Horse", "Pig", "All of the above"], correct: 3 },
      { q: "What is the name of the main city in Adopt Me?", a: ["Adoption Island", "Pet City", "Roblox Town", "Adopt City"], correct: 0 },
      { q: "How many stages does a pet have?", a: ["3", "4", "5", "6"], correct: 1 },
      { q: "Which egg costs the most Bucks?", a: ["Royal Egg", "Pet Egg", "Cracked Egg", "Farm Egg"], correct: 0 },
      { q: "What was the first limited pet in Adopt Me?", a: ["Halloween Cat", "Blue Dog", "Pink Cat", "Ghost Dragon"], correct: 2 },
    ]
  },
  "which-roblox-game": {
    title: "Which Roblox Game Are You?",
    game: "All Games",
    difficulty: "Medium",
    angle: "Beginner",
    questions: [
      { q: "What do you enjoy most in games?", a: ["Fighting & combat", "Roleplay & socializing", "Collecting & trading", "Parkour & challenges"], correct: 0 },
      { q: "How competitive are you?", a: ["Very competitive", "Somewhat competitive", "Not at all", "Only with friends"], correct: 0 },
      { q: "What's your favorite game setting?", a: ["Fantasy ocean world", "Suburban neighborhood", "Magical pet world", "Obstacle course"], correct: 0 },
      { q: "How long do you play per session?", a: ["1-2 hours grinding", "30 mins casual", "All day collecting", "Quick 10 min runs"], correct: 0 },
      { q: "What motivates you most?", a: ["Getting stronger", "Making friends", "Owning rare items", "Beating records"], correct: 0 },
      { q: "Pick a color:", a: ["Red & orange", "Blue & purple", "Pink & yellow", "Green & white"], correct: 0 },
      { q: "Favorite type of challenge?", a: ["Boss battles", "Social scenarios", "Trading puzzles", "Physical obstacles"], correct: 0 },
      { q: "What's your playstyle?", a: ["Aggressive", "Chill", "Strategic", "Speedrunner"], correct: 0 },
      { q: "Pick a superpower:", a: ["Super strength", "Invisibility", "Mind control", "Super speed"], correct: 0 },
      { q: "What do you want from a game?", a: ["Power & progression", "Fun & freedom", "Collection & value", "Skill & precision"], correct: 0 },
    ]
  }
};

async function generateIntro(game: string, title: string, angle: string, difficulty: string): Promise<string | null> {
  try {
    const prompt = `Write a 2-3 sentence intro paragraph for a Roblox ${game} quiz titled "${title}". 
The quiz angle is "${angle}" and difficulty is "${difficulty}".
Reference specific ${game} game mechanics, items, areas, or lore relevant to this angle.
Do NOT use generic phrases like "Test your knowledge" or "Can you get a perfect score".
Write it as if a fan is hyping up another player.
Return ONLY the intro text, no quotes, no markdown, nothing else.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.content?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: any[] = [];

  // Collect all quizzes to migrate
  const toMigrate: { slug: string; data: any }[] = [];

  // 1. Static quizzes
  for (const [slug, quiz] of Object.entries(STATIC_QUIZZES)) {
    toMigrate.push({ slug, data: quiz });
  }

  // 2. JSON file quizzes
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      toMigrate.push({ slug, data: content });
    }
  } catch (e: any) {
    results.push({ status: "error", message: "Failed to read JSON dir: " + e.message });
  }

  // Process in batches - limit per run to avoid timeout
  let processed = 0;
  const BATCH_LIMIT = 10;

  for (const { slug, data: quiz } of toMigrate) {
    if (processed >= BATCH_LIMIT) break;

    // Check if already in Supabase
    const { data: existing } = await supabase
      .from("quizzes")
      .select("slug, intro")
      .eq("slug", slug)
      .single();

    if (existing && existing.intro) {
      results.push({ slug, status: "already_exists_with_intro" });
      continue;
    }

    // Generate intro
    const intro = await generateIntro(
      quiz.game,
      quiz.title,
      quiz.angle || "General",
      quiz.difficulty
    );

    if (!intro) {
      results.push({ slug, status: "intro_generation_failed" });
      processed++;
      continue;
    }

    if (existing) {
      // Exists in Supabase but no intro - just update
      const { error } = await supabase
        .from("quizzes")
        .update({ intro })
        .eq("slug", slug);

      results.push({ slug, status: error ? "update_failed" : "updated_intro", error: error?.message });
    } else {
      // Insert new quiz into Supabase
      const { error } = await supabase
        .from("quizzes")
        .insert({
          slug,
          title: quiz.title,
          game: quiz.game,
          difficulty: quiz.difficulty,
          angle: quiz.angle || null,
          questions: quiz.questions,
          intro,
          published_at: new Date().toISOString(),
        });

      results.push({
        slug,
        status: error ? "insert_failed" : "inserted",
        error: error?.message,
        intro_preview: intro.substring(0, 50),
      });
    }

    processed++;
  }

  // Count remaining
  const remaining = toMigrate.length - results.filter(r =>
    r.status === "already_exists_with_intro" ||
    r.status === "inserted" ||
    r.status === "updated_intro"
  ).length;

  return NextResponse.json({
    total_found: toMigrate.length,
    processed: results.length,
    remaining,
    results,
  });
}