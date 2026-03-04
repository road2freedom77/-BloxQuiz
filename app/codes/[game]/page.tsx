import { notFound } from "next/navigation";
import { codesData } from "../../data/codes";
import CodesClient from "./CodesClient";

const gameDescriptions: Record<string, string> = {
  "blox-fruits": "Blox Fruits codes give players free XP boosts, stat resets, and Beli to help progress faster through the seas. New codes are released during updates and milestones.",
  "adopt-me": "Adopt Me codes give players free Bucks to spend on eggs, pets, and items. Codes are released during seasonal events and game milestones.",
  "murder-mystery-2": "Murder Mystery 2 codes give players free knives and other cosmetic rewards. New codes drop during seasonal events and collaborations.",
  "grow-a-garden": "Grow a Garden codes give players free seeds, fertilizer, and tools to help grow their garden faster. Codes are released with major updates.",
  "brookhaven-rp": "Brookhaven RP codes give players free items and vehicles to use in their roleplay sessions. New codes are released during updates and events.",
  "tower-of-hell": "Tower of Hell codes give players free modifiers and rings to customize their climbing experience. Codes drop during special events.",
  "royale-high": "Royale High codes give players free diamonds to spend on accessories and cosmetics. Codes are released during seasonal events and collaborations.",
  "doors": "Doors codes give players free Knobs to spend in the shop on items and cosmetics. New codes are released with major floor updates.",
  "arsenal": "Arsenal codes give players free skins and Bucks to customize their loadout. Codes drop during seasonal events and collaborations.",
  "anime-fighting-simulator": "Anime Fighting Simulator codes give players free Chikara Shards and Yen to power up their character faster. Codes release with major updates.",
  "berry-avenue": "Berry Avenue codes give players free cash and items to use in their roleplay experience. New codes drop during updates and events.",
  "livetopia": "Livetopia codes give players free coins and items to enjoy in their virtual world. Codes are released during updates and special events.",
  "natural-disaster-survival": "Natural Disaster Survival codes give players free badges and rewards. Codes drop during special events and game milestones.",
  "anime-defenders": "Anime Defenders codes give players free gems to use for summons and upgrades. New codes release with major unit and content updates.",
  "funky-friday": "Funky Friday codes give players free points to unlock songs and cosmetics. Codes drop during collaborations and community milestones.",
  "kick-off": "Kick Off codes give players free coins and skins to customize their football experience. New codes release during tournaments and updates.",
};

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const data = codesData[game];
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.game} Codes 2026 — All Active & Working Codes | BloxQuiz`,
    description: `All active ${data.game} codes for 2026. ${data.codes.filter(c => c.active).length} working codes updated ${data.updatedAt}. Redeem free rewards before they expire!`,
    alternates: { canonical: `https://www.bloxquiz.gg/codes/${game}` },
    openGraph: {
      title: `${data.game} Codes 2026 — All Active Codes | BloxQuiz`,
      description: `${data.codes.filter(c => c.active).length} active ${data.game} codes. Updated daily on BloxQuiz.gg`,
      url: `https://www.bloxquiz.gg/codes/${game}`,
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

export default async function CodesGamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const data = codesData[game];
  if (!data) notFound();

  const activeCodes = data.codes.filter((c: any) => c.active);
  const expiredCodes = data.codes.filter((c: any) => !c.active);
  const description = gameDescriptions[game] || `Find all active ${data.game} codes here. Updated regularly with the latest working codes.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": "Roblox Codes", "item": "https://www.bloxquiz.gg/codes" },
          { "@type": "ListItem", "position": 3, "name": `${data.game} Codes`, "item": `https://www.bloxquiz.gg/codes/${game}` },
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How do I redeem ${data.game} codes?`,
            "acceptedAnswer": { "@type": "Answer", "text": data.redeemSteps ? data.redeemSteps.join(". ") : `Open ${data.game} and look for the Codes button in the menu. Enter the code exactly as shown and press Redeem.` }
          },
          {
            "@type": "Question",
            "name": `How many active ${data.game} codes are there?`,
            "acceptedAnswer": { "@type": "Answer", "text": `There are currently ${activeCodes.length} active ${data.game} codes. This page is updated regularly with the latest working codes.` }
          },
          {
            "@type": "Question",
            "name": `Do ${data.game} codes expire?`,
            "acceptedAnswer": { "@type": "Answer", "text": `Yes, ${data.game} codes expire. Redeem them as soon as possible to avoid missing out on free rewards.` }
          },
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CodesClient data={data} game={game} description={description} activeCodes={activeCodes} expiredCodes={expiredCodes} />
    </>
  );
}