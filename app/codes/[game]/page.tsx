import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CodesClient from "./CodesClient";
import GameCrossLinks from "../../components/GameCrossLinks";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
  "king-legacy": "King Legacy codes give players free gems, stat resets, and EXP boosts to help progress through the seas faster. New codes drop during major updates.",
  "shindo-life": "Shindo Life codes give players free spins and RELL Coins to unlock new bloodlines and abilities. Codes release regularly from the developers.",
  "grand-piece-online": "Grand Piece Online codes give players free EXP and drop boosts to help grind faster. New codes drop during updates and milestones.",
  "demon-slayer-rpg-2": "Demon Slayer RPG 2 codes give players free resets and EXP boosts to help reroll stats and progress faster. Codes drop with major updates.",
  "blade-ball": "Blade Ball codes give players free wheel spins, luck boosts, and exclusive sword skins. New codes release frequently with updates.",
  "blue-lock-rivals": "Blue Lock: Rivals codes give players free style spins, flow spins, and ego tokens to unlock new abilities. Codes drop during updates and milestones.",
  "jujutsu-infinite": "Jujutsu Infinite codes give players free spins to unlock new techniques and abilities. Codes release during community milestones.",
  "jujutsu-shenanigans": "Jujutsu Shenanigans codes give players free achievements and exclusive emotes. Codes are released during updates and special events.",
  "type-soul": "Type Soul codes give players free rerolls to change their abilities and stats. Codes drop frequently from the developers.",
  "fruit-battlegrounds": "Fruit Battlegrounds codes give players free gems and titles to customize their experience. New codes release during updates.",
  "untitled-boxing-game": "Untitled Boxing Game codes give players free spins and cash to upgrade their fighter. Codes drop during updates and milestones.",
  "sols-rng": "Sol's RNG codes give players free potion chests and luck boosts to roll rare auras. New codes release with every major update.",
  "tower-defense-simulator": "Tower Defense Simulator codes give players free EXP, coins, and exclusive skins. Codes drop during seasonal events and milestones.",
  "all-star-tower-defense": "All Star Tower Defense codes give players free stardust and gems to summon new units. Codes release during updates and collaborations.",
  "toilet-tower-defense": "Toilet Tower Defense codes give players free coins and boosts to upgrade their defenses. New codes drop with major updates.",
  "anime-vanguards": "Anime Vanguards codes give players free gems, trait rerolls, and memoria shards to strengthen their units. Codes release frequently.",
  "da-hood": "Da Hood codes give players free DHC (Da Hood Cash) to spend on weapons and gear. New codes drop during seasonal events.",
  "evade": "Evade codes give players free points and tokens to unlock cosmetics and upgrades. Codes release during updates and community events.",
  "dandys-world": "Dandy's World codes give players free Ichor to spend on cosmetics and upgrades. New codes drop during updates.",
  "murder-party": "Murder Party codes give players free gems and exclusive cosmetics. Codes release during seasonal events and milestones.",
  "build-a-boat-for-treasure": "Build A Boat For Treasure codes give players free gold and exclusive blocks to build better boats. Codes drop during updates.",
  "driving-empire": "Driving Empire codes give players free cash, tuning kits, and exclusive vehicles. New codes release frequently with updates.",
};

async function getGameStats(slug: string): Promise<{ currentPlayers: number | null; totalVisits: number | null } | null> {
  try {
    const { data } = await supabaseAdmin
      .from("roblox_games")
      .select("current_players, total_visits")
      .eq("slug", slug)
      .single();
    if (!data) return null;
    return { currentPlayers: data.current_players, totalVisits: data.total_visits };
  } catch (e) {
    return null;
  }
}

async function getQuizCount(slug: string): Promise<number> {
  try {
    const { data } = await supabaseAdmin
      .from("roblox_games")
      .select("name")
      .eq("slug", slug)
      .single();
    if (!data) return 0;
    const { count } = await supabaseAdmin
      .from("quizzes")
      .select("id", { count: "exact", head: true })
      .eq("game", data.name)
      .eq("status", "published");
    return count ?? 0;
  } catch (e) {
    return 0;
  }
}

async function getActiveCodeGames(excludeSlug: string): Promise<{ slug: string; game: string; icon: string }[]> {
  try {
    const { data: activeSlugs } = await supabaseAdmin
      .from("codes")
      .select("slug")
      .eq("active", true);

    if (!activeSlugs || activeSlugs.length === 0) return [];

    const uniqueSlugs = [...new Set(activeSlugs.map((r) => r.slug))].filter(
      (s) => s !== excludeSlug
    );

    if (uniqueSlugs.length === 0) return [];

    const { data: games } = await supabaseAdmin
      .from("code_games")
      .select("slug, game, icon")
      .in("slug", uniqueSlugs)
      .limit(6);

    return games ?? [];
  } catch (e) {
    return [];
  }
}

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
    description: `All active ${gameData.game} codes for 2026. ${activeCount} working codes — verified and updated when new codes are released. Redeem free rewards before they expire!`,
    alternates: { canonical: `https://www.bloxquiz.gg/codes/${game}` },
    openGraph: {
      title: `${gameData.game} Codes 2026 — All Active Codes | BloxQuiz`,
      description: `${activeCount} active ${gameData.game} codes. Verified and updated on BloxQuiz.gg`,
      url: `https://www.bloxquiz.gg/codes/${game}`,
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

export default async function CodesGamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;

  const [{ data: gameData }, { data: codesData }, statsData, quizCount, activeCodeGames] = await Promise.all([
    supabase.from("code_games").select("*").eq("slug", game).single(),
    supabase.from("codes").select("*").eq("slug", game).order("is_new", { ascending: false }),
    getGameStats(game),
    getQuizCount(game),
    getActiveCodeGames(game),
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
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Roblox Codes", item: "https://www.bloxquiz.gg/codes" },
          { "@type": "ListItem", position: 3, name: `${data.game} Codes`, item: `https://www.bloxquiz.gg/codes/${game}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How do I redeem ${data.game} codes?`,
            acceptedAnswer: { "@type": "Answer", text: data.howToRedeem },
          },
          {
            "@type": "Question",
            name: `How many active ${data.game} codes are there?`,
            acceptedAnswer: { "@type": "Answer", text: `There are currently ${activeCodes.length} active ${data.game} codes. This page is checked regularly and updated when new codes are confirmed.` },
          },
          {
            "@type": "Question",
            name: `Do ${data.game} codes expire?`,
            acceptedAnswer: { "@type": "Answer", text: `Yes, ${data.game} codes expire. Redeem them as soon as possible to avoid missing out on free rewards.` },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 0" }}>
        <GameCrossLinks
          slug={game}
          gameName={data.game}
          hasQuizzes={quizCount > 0}
          hasCodes={true}
          hasStats={true}
          activeTab="codes"
        />
      </div>
      <CodesClient
        data={data}
        game={game}
        description={description}
        activeCodes={activeCodes}
        expiredCodes={expiredCodes}
        statsData={statsData}
        activeCodeGames={activeCodeGames}
      />
    </>
  );
}