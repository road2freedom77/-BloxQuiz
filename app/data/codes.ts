export const LAST_UPDATED = "March 9, 2026";

export type GameCode = {
  code: string;
  reward: string;
  active: boolean;
  isNew?: boolean;
};

export type GameCodes = {
  game: string;
  slug: string;
  icon: string;
  updatedAt: string;
  codes: GameCode[];
  noCodesMessage?: string;
  howToRedeem: string;
};

export const ALL_CODES: GameCodes[] = [
  {
    game: "Blox Fruits",
    slug: "blox-fruits",
    icon: "⚔️",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the gear icon on the left → Redeem Codes tab → enter code → Redeem",
    codes: [
      { code: "TRIPLEFLASH", reward: "2x EXP for 20 minutes", active: true, isNew: true },
      { code: "Lightningabuse", reward: "2x EXP for 20 minutes", active: true, isNew: true },
      { code: "KITT_RESET", reward: "1 free Stat Reset", active: true },
      { code: "Sub2UncleKizaru", reward: "1 free Stat Reset", active: true },
      { code: "fudd10_v2", reward: "$2 in-game Beli", active: true },
      { code: "Fudd10", reward: "$1 in-game Beli", active: true },
      { code: "Bignews", reward: "Free in-game Title", active: true },
      { code: "kittgaming", reward: "2x EXP for 20 minutes", active: true },
      { code: "Sub2CaptainMaui", reward: "2x EXP for 20 minutes", active: true },
      { code: "Enyu_is_Pro", reward: "2x EXP for 20 minutes", active: true },
      { code: "Magicbus", reward: "2x EXP for 20 minutes", active: true },
      { code: "JCWK", reward: "2x EXP for 20 minutes", active: true },
      { code: "Bluxxy", reward: "2x EXP for 20 minutes", active: true },
      { code: "TheGreatAce", reward: "2x EXP for 20 minutes", active: true },
      { code: "Sub2OfficialNoobie", reward: "2x EXP for 20 minutes", active: true },
      { code: "Sub2NoobMaster123", reward: "2x EXP for 20 minutes", active: true },
      { code: "Axiore", reward: "2x EXP for 20 minutes", active: true },
      { code: "Sub2Daigrock", reward: "2x EXP for 20 minutes", active: true },
      { code: "TantaiGaming", reward: "2x EXP for 20 minutes", active: true },
      { code: "StrawHatMaine", reward: "2x EXP for 20 minutes", active: false },
    ],
  },
  {
    game: "Brookhaven RP",
    slug: "brookhaven-rp",
    icon: "🏠",
    updatedAt: "March 8, 2026",
    howToRedeem: "Requires Music Unlimited pass (199 Robux) → click car icon → music speaker → enter ID",
    noCodesMessage: "Brookhaven codes are music IDs. They require the Music Unlimited pass (199 Robux) to use in-game.",
    codes: [
      { code: "1845682760", reward: "Hallelujah", active: true },
      { code: "1330132640", reward: "Michael Jackson – Smooth Criminal", active: true },
      { code: "1836454247", reward: "The Weeknd – Blinding Lights", active: true },
      { code: "1846033382", reward: "Maroon 5 – Moves Like Jagger", active: true },
      { code: "1836702661", reward: "Taylor Swift – You Belong With Me", active: true },
    ],
  },
  {
    game: "Adopt Me!",
    slug: "adopt-me",
    icon: "🐾",
    updatedAt: "March 8, 2026",
    howToRedeem: "No active codes at this time. Check back around Easter for seasonal codes.",
    noCodesMessage: "No active codes right now. Adopt Me rarely releases codes — they typically appear during seasonal events.",
    codes: [],
  },
  {
    game: "Murder Mystery 2",
    slug: "murder-mystery-2",
    icon: "🔪",
    updatedAt: "March 9, 2026",
    howToRedeem: "Click Inventory in lobby → EnterCode box (bottom right) → Redeem",
    noCodesMessage: "No active codes right now. MM2 codes are extremely rare — the developer hasn't released one in over a year.",
    codes: [],
  },
  {
    game: "Murder Mystery 2",
    slug: "murder-mystery-2",
    icon: "🔪",
    updatedAt: "March 9, 2026",
    howToRedeem: "Click Inventory in lobby → EnterCode box (bottom right) → Redeem",
    noCodesMessage: "No active codes right now. MM2 codes are extremely rare — the developer hasn't released one in over a year.",
    codes: [],
  },
  {
    game: "Grow a Garden",
    slug: "grow-a-garden",
    icon: "🌱",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the cog icon (top left) → scroll to Redeem Codes → type code → Claim",
    codes: [
      { code: "SPROUT", reward: "Free Seed Pack", active: true, isNew: true },
      { code: "GARDEN", reward: "Free Seed Pack", active: true },
      { code: "FREEBIES", reward: "Free Seed Pack", active: true },
    ],
  },
  {
    game: "Royale High",
    slug: "royale-high",
    icon: "👑",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the Shop button (right side of screen) → scroll to redeem codes section → enter code",
    codes: [
      { code: "SmythsChandelier2024", reward: "Precious Flower Chandelier decoration", active: true },
    ],
  },
  {
    game: "Doors",
    slug: "doors",
    icon: "🚪",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the Shop icon (left side) → enter code in text box → checkmark to redeem",
    noCodesMessage: "No active codes right now. DOORS codes are milestone-based and rare — check back after major updates.",
    codes: [
      { code: "SURVIVE", reward: "Free Knobs", active: true, isNew: true },
    ],
  },
  {
    game: "Arsenal",
    slug: "arsenal",
    icon: "🔫",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the gift icon (bottom left of main menu) → enter code → REDEEM",
    codes: [
      { code: "ARSENALSEASON10", reward: "Free skin", active: true, isNew: true },
      { code: "kekw", reward: "Announcer voice", active: true },
      { code: "ROLVe", reward: "ROLVe Announcer Pack", active: true },
      { code: "GetSome", reward: "Get Some Announcer Pack", active: true },
      { code: "STATSANDSTUFF", reward: "Stats and Stuff Announcer Pack", active: true },
      { code: "Bandites", reward: "Bandites Announcer Pack", active: true },
      { code: "BRAWL", reward: "Teleport to Brawl map", active: true },
      { code: "FATE", reward: "Teleport to Fate map", active: true },
    ],
  },
  {
    game: "Anime Fighting Simulator",
    slug: "anime-fighting-simulator",
    icon: "💥",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the ↓ arrow (bottom left) → Codes tab → enter code → Redeem",
    codes: [
      { code: "WeekendEXPCode", reward: "EXP boost", active: true, isNew: true },
      { code: "Dim2Soon", reward: "Chikara + Yen", active: true, isNew: true },
      { code: "DIMENSION3", reward: "Chikara Shards", active: true },
      { code: "AFS3YEARS", reward: "Chikara Shards + Yen", active: true },
      { code: "Sub2Bravingitall", reward: "Chikara Shards", active: true },
      { code: "Sub2kawaiipanda12", reward: "Chikara Shards", active: true },
    ],
  },
  {
    game: "Berry Avenue",
    slug: "berry-avenue",
    icon: "🫐",
    updatedAt: "March 8, 2026",
    howToRedeem: "Tap arrow (right side) → AVATAR → MENU → Equipped → IMPORT ID → enter code",
    codes: [
      { code: "77481867185789", reward: "Pink Preppy Summer outfit", active: true, isNew: true },
      { code: "5173577947", reward: "Free outfit item", active: true },
      { code: "2524675805", reward: "Free outfit item", active: true },
      { code: "1567446376", reward: "Free outfit item", active: true },
    ],
  },
  {
    game: "Livetopia",
    slug: "livetopia",
    icon: "🏙️",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the Twitter/Codes icon in the lobby → enter code → Redeem",
    noCodesMessage: "No active codes right now. Livetopia releases codes during updates and events — check back soon.",
    codes: [],
  },
  {
    game: "Natural Disaster Survival",
    slug: "natural-disaster-survival",
    icon: "🌪️",
    updatedAt: "March 8, 2026",
    howToRedeem: "Natural Disaster Survival does not have a codes system.",
    noCodesMessage: "Natural Disaster Survival is a classic Roblox experience with no codes system. Enjoy the pure survival gameplay!",
    codes: [],
  },
  {
    game: "Anime Defenders",
    slug: "anime-defenders",
    icon: "🛡️",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the '…' button (top left) → Codes → enter code → Redeem (requires Level 8+)",
    codes: [
      { code: "DEFENDERS2026", reward: "Free Gems", active: true, isNew: true },
      { code: "YEARZERO", reward: "Free Gems", active: true },
      { code: "1BILLION", reward: "Free Gems + Tokens", active: true },
      { code: "PATCHFIX", reward: "Free Gems", active: true },
      { code: "SORRYFORWAIT", reward: "Free Gems", active: true },
      { code: "NEWSEASON", reward: "Free Gems", active: true },
      { code: "HALFYEAR", reward: "Gems + Tokens", active: true },
    ],
  },
  {
    game: "Funky Friday",
    slug: "funky-friday",
    icon: "🎵",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the shopping cart icon (top left) → Twitter bird icon → enter code → REDEEM",
    codes: [
      { code: "fridaynight", reward: "Free Points", active: true },
      { code: "GROOVY", reward: "Free Points", active: true },
      { code: "SWAG", reward: "Free Points", active: true },
      { code: "lytegames", reward: "Free Points", active: true },
      { code: "funkyfriday", reward: "Free Points", active: true },
    ],
  },
  {
    game: "Kick Off",
    slug: "kick-off",
    icon: "⚽",
    updatedAt: "March 8, 2026",
    howToRedeem: "Click the Codes button in the main menu → enter code → Redeem",
    noCodesMessage: "No active codes right now. Check back after major updates for new codes.",
    codes: [],
  },
];

export function getCodesBySlug(slug: string): GameCodes | undefined {
  return ALL_CODES.find((g) => g.slug === slug);
}

export function getAllGamesWithCodes(): GameCodes[] {
  return ALL_CODES.filter((g) => g.codes.length > 0);
}

export function getTotalActiveCodesCount(): number {
  return ALL_CODES.reduce((sum, g) => sum + g.codes.length, 0);
}

export const codesData = ALL_CODES;