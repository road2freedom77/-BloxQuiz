/**
 * scripts/merge-game-tips.ts
 * 
 * Merges game-tips-generated.json into CodesClient.tsx gameTips and gameRewards records.
 * Run AFTER reviewing and editing scripts/output/game-tips-generated.json
 * 
 * Run: npx tsx app/scripts/merge-game-tips.ts
 */

import fs from "fs";
import path from "path";

const JSON_PATH = path.join(process.cwd(), "scripts/output/game-tips-generated.json");
const CLIENT_PATH = path.join(process.cwd(), "app/codes/[game]/CodesClient.tsx");

// Manual fixes for wrong reward descriptions flagged in review
const REWARD_FIXES: Record<string, string[]> = {
  "blade-ball": ["Coins for cosmetics", "Blade skins and weapon cosmetics", "Experience boosters and multipliers"],
  "forsaken": ["Coins for cosmetics", "Exclusive cosmetic skins and accessories", "Special event items and power-ups"],
  "type-soul": ["RC and premium currency for cosmetics", "Battle pass points and seasonal progression", "Exclusive skins and character appearance items"],
  "zombie-attack": ["Coins for in-game purchases", "Exclusive weapon skins and cosmetics", "Experience boosters and survival bonuses"],
};

function buildTipsEntry(slug: string, tips: string): string {
  return `  "${slug}": "${tips.replace(/"/g, '\\"')}",`;
}

function buildRewardsEntry(slug: string, rewards: string[]): string {
  const items = rewards.map(r => `    "${r.replace(/"/g, '\\"')}"`).join(",\n");
  return `  "${slug}": [\n${items}\n  ],`;
}

function main() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error("JSON file not found:", JSON_PATH);
    process.exit(1);
  }

  if (!fs.existsSync(CLIENT_PATH)) {
    console.error("CodesClient.tsx not found:", CLIENT_PATH);
    process.exit(1);
  }

  const generated: Record<string, { tips: string; rewards: string[] }> = JSON.parse(
    fs.readFileSync(JSON_PATH, "utf8")
  );

  // Apply manual fixes
  for (const [slug, rewards] of Object.entries(REWARD_FIXES)) {
    if (generated[slug]) {
      generated[slug].rewards = rewards;
      console.log(`Applied reward fix for: ${slug}`);
    }
  }

  let content = fs.readFileSync(CLIENT_PATH, "utf8");

  // Build new entries
  const newTipsEntries = Object.entries(generated)
    .map(([slug, data]) => buildTipsEntry(slug, data.tips))
    .join("\n");

  const newRewardsEntries = Object.entries(generated)
    .map(([slug, data]) => buildRewardsEntry(slug, data.rewards))
    .join("\n");

  // Insert into gameTips — find the closing }; of the record and insert before it
  const tipsPattern = /(const gameTips: Record<string, string> = \{[\s\S]*?)(};)/;
  const tipsMatch = content.match(tipsPattern);
  if (!tipsMatch) {
    console.error("Could not find gameTips record in CodesClient.tsx");
    process.exit(1);
  }

  content = content.replace(
    tipsPattern,
    `$1${newTipsEntries}\n$2`
  );

  // Insert into gameRewards
  const rewardsPattern = /(const gameRewards: Record<string, string\[\]> = \{[\s\S]*?)(};)/;
  const rewardsMatch = content.match(rewardsPattern);
  if (!rewardsMatch) {
    console.error("Could not find gameRewards record in CodesClient.tsx");
    process.exit(1);
  }

  content = content.replace(
    rewardsPattern,
    `$1${newRewardsEntries}\n$2`
  );

  // Write back
  fs.writeFileSync(CLIENT_PATH, content, "utf8");
  console.log(`\nDone. Added ${Object.keys(generated).length} games to CodesClient.tsx`);
  console.log("Deploy CodesClient.tsx to apply changes to all codes pages.");
}

main();