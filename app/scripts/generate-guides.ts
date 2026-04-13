/**
 * scripts/generate-guides.ts
 *
 * Generates game guide DRAFTS for the next 10 Roblox games.
 * Saves to game_guides table with status='draft' — never auto-publishes.
 * Review each guide in Supabase and flip status to 'published' manually.
 *
 * Run: npx tsx app/scripts/generate-guides.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

const GAMES = [
  {
    slug: "funky-friday",
    name: "Funky Friday",
    genre: "Rhythm / Music",
    guideSlug: "funky-friday-beginners-guide",
    title: "Funky Friday Beginner's Guide (2026) — How to Play, Rank Up & Hit Better Notes",
    difficulty: "Beginner",
  },
];

const GUIDE_PROMPT = (game: { name: string; genre: string; title: string }) => `
You are writing a comprehensive beginner's guide for the Roblox game "${game.name}" (genre: ${game.genre}) for BloxQuiz.gg.

The guide title is: "${game.title}"

Write a detailed, helpful, accurate guide. Be specific to ${game.name} — avoid generic advice that could apply to any game.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "intro": "3 paragraph introduction (300+ words total). Paragraph 1: what ${game.name} is and why players love it. Paragraph 2: what new players can expect in their first session. Paragraph 3: what this guide covers and who it's for.",
  "who_this_is_for": "2 sentences describing exactly who will benefit most from this guide.",
  "sections": [
    {
      "heading": "Getting Started in ${game.name}",
      "body": "200+ word section covering the very first things a new player should do when they launch ${game.name} for the first time. Be specific and practical."
    },
    {
      "heading": "Key Mechanics Explained",
      "body": "200+ word section explaining the core systems and mechanics that make ${game.name} work. What must a player understand to progress?"
    },
    {
      "heading": "Best Early Strategies",
      "body": "200+ word section covering the most effective approaches for new players in ${game.name}. What should they prioritize? What gives the best returns early on?"
    },
    {
      "heading": "Common Mistakes New Players Make",
      "body": "200+ word section covering the most frequent mistakes beginners make in ${game.name} and exactly how to avoid them."
    },
    {
      "heading": "Progression Path — What to Do First",
      "body": "200+ word section laying out a clear step-by-step progression path for new players. Give them a roadmap for their first few hours."
    }
  ],
  "tips": [
    "Practical tip 1 specific to ${game.name}",
    "Practical tip 2 specific to ${game.name}",
    "Practical tip 3 specific to ${game.name}",
    "Practical tip 4 specific to ${game.name}",
    "Practical tip 5 specific to ${game.name}",
    "Practical tip 6 specific to ${game.name}",
    "Practical tip 7 specific to ${game.name}"
  ],
  "faqs": [
    { "q": "Specific FAQ question about ${game.name}?", "a": "Detailed answer specific to ${game.name}." },
    { "q": "Specific FAQ question about ${game.name}?", "a": "Detailed answer specific to ${game.name}." },
    { "q": "Specific FAQ question about ${game.name}?", "a": "Detailed answer specific to ${game.name}." },
    { "q": "Specific FAQ question about ${game.name}?", "a": "Detailed answer specific to ${game.name}." },
    { "q": "Specific FAQ question about ${game.name}?", "a": "Detailed answer specific to ${game.name}." }
  ]
}

Requirements:
- Every section body must be 200+ words
- Every tip must be specific to ${game.name}, not generic
- FAQs must be questions real ${game.name} beginners actually ask
- Do not use the word "daily"
- Do not mention specific Robux amounts or prices
- Write for a Roblox player audience aged 10-18
- Return only the JSON object, nothing else
`;

function countWords(obj: object): number {
  return JSON.stringify(obj).split(/\s+/).length;
}

async function generateGuide(game: typeof GAMES[0]): Promise<object | null> {
  console.log(`\nGenerating guide for ${game.name}...`);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 6000,
        messages: [{ role: "user", content: GUIDE_PROMPT(game) }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    console.log(`  ✓ Generated — ~${countWords(parsed)} words`);
    return parsed;
  } catch (e) {
    console.error(`  ✗ Failed:`, e);
    return null;
  }
}

async function saveGuide(game: typeof GAMES[0], content: object) {
  const wordCount = countWords(content);
  const contentObj = content as any;

  const excerpt = contentObj.intro
    ? contentObj.intro.substring(0, 300).replace(/\n/g, " ") + "..."
    : `A comprehensive beginner's guide to ${game.name} on Roblox.`;

  const metaTitle = `${game.title} | BloxQuiz`;
  const metaDescription = excerpt.substring(0, 160);

  const { error } = await supabase
    .from("game_guides")
    .upsert({
      game_slug: game.slug,
      game_name: game.name,
      slug: game.guideSlug,
      title: game.title,
      meta_title: metaTitle,
      meta_description: metaDescription,
      excerpt,
      difficulty: game.difficulty,
      status: "draft",
      word_count: wordCount,
      content,
      source_notes: `Generated by Claude Sonnet via generate-guides.ts on ${new Date().toISOString()}. Review for factual accuracy before publishing.`,
      last_verified_at: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "slug" });

  if (error) {
    console.error(`  ✗ DB save failed:`, error.message);
  } else {
    console.log(`  ✓ Saved to DB as DRAFT — slug: ${game.guideSlug}`);
  }
}

async function main() {
  console.log("BloxQuiz Guide Generator — Batch 2");
  console.log("====================================");
  console.log(`Generating ${GAMES.length} guide drafts using Claude Sonnet...`);
  console.log("All guides saved as DRAFT — review in Supabase before publishing.\n");

  let success = 0;
  let failed = 0;

  for (const game of GAMES) {
    const content = await generateGuide(game);
    if (content) {
      await saveGuide(game, content);
      success++;
    } else {
      failed++;
    }
    // Pause between API calls
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n====================================`);
  console.log(`Done. ${success} guides saved as drafts, ${failed} failed.`);
  console.log(`\nNext steps:`);
  console.log(`1. Open Supabase > game_guides table`);
  console.log(`2. Review each guide for factual accuracy`);
  console.log(`3. Edit content directly in Supabase or via admin panel`);
  console.log(`4. Flip status from 'draft' to 'published' when ready`);
}

main();