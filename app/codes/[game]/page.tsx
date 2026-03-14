import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CodesClient from "./CodesClient";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  "bee-swarm-simulator": "Bee Swarm Simulator codes give players free bees, gumdrops, tickets, and boosts to help grow their hive faster. New codes drop during game milestones and seasonal events.",
  "dress-to-impress": "Dress to Impress codes give players free exclusive outfits and accessories to wear on the runway. New codes release with major updates and seasonal events.",
  "fisch": "Fisch codes give players free coins, bait, and exclusive rods to help catch rare fish faster. New codes are released during updates and game milestones.",
};

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;

  const [{ data: gameData }, { data: codesData }] = await Promise.all([
    supabase.from("code_games").select("game").eq("slug", game).single(),
    supabase.from("codes").select("active").eq("slug", game),
  ]);

  if (!gameData) return { title: "Not Found" };

  const activeCount = (codesData ?? []).filter((c) => c.active).length;

  return {
    title: `${gameData.game} Codes 2026 — All Active & Working Codes | BloxQuiz`,
    description: `All active ${gameData.game} codes for 2026. ${activeCount} working codes updated daily. Redeem free rewards before they expire!`,
    alternates: { canonical: `https://www.bloxquiz.gg/codes/${game}` },
    openGraph: {
      title: `${gameData.game} Codes 2026 — All Active Codes | BloxQuiz`,
      description: `${activeCount} active ${gameData.game} codes. Updated daily on BloxQuiz.gg`,
      url: `https://www.bloxquiz.gg/codes/${game}`,
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

export default async function CodesGamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;

  const [{ data: gameData }, { data: codesData }] = await Promise.all([
    supabase.from("code_games").select("*").eq("slug", game).single(),
    supabase.from("codes").select("*").eq("slug", game).order("is_new", { ascending: false }),
  ]);

  if (!gameData) notFound();

  const activeCodes = (codesData ?? []).filter((c) => c.active);
  const expiredCodes = (codesData ?? []).filter((c) => !c.active);
  const description = gameDescriptions[game] || `Find all active ${gameData.game} codes here. Updated regularly with the latest working codes.`;

  const data = {
    game: gameData.game,
    slug: gameData.slug,
    icon: gameData.icon,
    howToRedeem: gameData.how_to_redeem,
    noCodesMessage: gameData.no_codes_message,
    updatedAt: new Date(gameData.updated_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": "Roblox Codes", "item": "https://www.bloxquiz.gg/codes" },
          { "@type": "ListItem", "position": 3, "name": `${data.game} Codes`, "item": `https://www.bloxquiz.gg/codes/${game}` },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How do I redeem ${data.game} codes?`,
            "acceptedAnswer": { "@type": "Answer", "text": data.howToRedeem },
          },
          {
            "@type": "Question",
            "name": `How many active ${data.game} codes are there?`,
            "acceptedAnswer": { "@type": "Answer", "text": `There are currently ${activeCodes.length} active ${data.game} codes. This page is updated regularly with the latest working codes.` },
          },
          {
            "@type": "Question",
            "name": `Do ${data.game} codes expire?`,
            "acceptedAnswer": { "@type": "Answer", "text": `Yes, ${data.game} codes expire. Redeem them as soon as possible to avoid missing out on free rewards.` },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CodesClient
        data={data}
        game={game}
        description={description}
        activeCodes={activeCodes}
        expiredCodes={expiredCodes}
      />
    </>
  );
}