export const codesData: Record<string, {
  game: string;
  icon: string;
  slug: string;
  updatedAt: string;
  redeemSteps: string[];
  codes: { code: string; reward: string; active: boolean }[];
}> = {
  "blox-fruits": {
    game: "Blox Fruits",
    icon: "⚔️",
    slug: "blox-fruits",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Launch Blox Fruits and join a server",
      "Look for the Twitter bird icon on the left side of the screen",
      "Click it to open the codes menu",
      "Type the code exactly and press Enter to redeem",
    ],
    codes: [
      { code: "TRIPLEFLASH", reward: "2x XP Boost (20 min)", active: true },
      { code: "NOOB_MASTER69", reward: "2x XP Boost", active: true },
      { code: "SUB2GAMERROBOT_EXP1", reward: "2x XP Boost", active: true },
      { code: "SUB2GAMERROBOT_RESET1", reward: "Stat Reset", active: true },
      { code: "FUDD10", reward: "$1 Beli", active: true },
      { code: "BIGNEWS", reward: "In-game reward", active: true },
      { code: "STRAWHATMAINE", reward: "2x XP Boost (20 min)", active: false },
      { code: "ADMIN_RESET_TROLL", reward: "Stat Reset", active: false },
    ]
  },
  "adopt-me": {
    game: "Adopt Me!",
    icon: "🐾",
    slug: "adopt-me",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Adopt Me! on Roblox",
      "Click the Twitter icon on the right side of the screen",
      "Enter the code in the text box",
      "Press Redeem to claim your reward",
    ],
    codes: [
      { code: "SUMMERFUN", reward: "Free Buck", active: true },
      { code: "WINTERSALE", reward: "Free Buck", active: true },
      { code: "GIFTUNWRAP", reward: "Free Buck", active: true },
      { code: "REBORNBUCKS", reward: "Free Buck", active: false },
      { code: "ADOPTME2024", reward: "Free Buck", active: false },
    ]
  },
  "murder-mystery-2": {
    game: "Murder Mystery 2",
    icon: "🔫",
    slug: "murder-mystery-2",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Murder Mystery 2 on Roblox",
      "Click the Inventory button at the bottom of the screen",
      "Click the Codes button",
      "Enter the code and press Redeem",
    ],
    codes: [
      { code: "COMB4T2", reward: "Free Knife", active: true },
      { code: "COMB4T1", reward: "Free Knife", active: true },
      { code: "PR1SM", reward: "Free Knife", active: true },
      { code: "CORRUPT", reward: "Free Knife", active: true },
      { code: "DARKNESS", reward: "Free Knife", active: false },
      { code: "GHOST", reward: "Free Knife", active: false },
    ]
  },
  "grow-a-garden": {
    game: "Grow a Garden",
    icon: "🌱",
    slug: "grow-a-garden",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Grow a Garden on Roblox",
      "Click the Codes button on the side of the screen",
      "Enter your code in the text field",
      "Click Redeem to claim your reward",
    ],
    codes: [
      { code: "GARDEN2026", reward: "Free Seeds", active: true },
      { code: "SPROUT", reward: "Free Fertilizer", active: true },
      { code: "HARVEST", reward: "Free Tools", active: true },
      { code: "BLOOM2025", reward: "Free Seeds", active: false },
    ]
  },
  "brookhaven-rp": {
    game: "Brookhaven RP",
    icon: "🏠",
    slug: "brookhaven-rp",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Brookhaven RP on Roblox",
      "Click the Codes button in the menu",
      "Type the code exactly as shown",
      "Press Enter to redeem your reward",
    ],
    codes: [
      { code: "BROOKHAVEN2026", reward: "Free Item", active: true },
      { code: "ROLEPLAY", reward: "Free Item", active: true },
      { code: "SUBURB", reward: "Free Car", active: false },
    ]
  },
  "tower-of-hell": {
    game: "Tower of Hell",
    icon: "🗼",
    slug: "tower-of-hell",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Tower of Hell on Roblox",
      "Click the Shop button on the left side",
      "Click Codes at the top of the shop",
      "Enter the code and press Redeem",
    ],
    codes: [
      { code: "FLIGHTMODE", reward: "Free Modifier", active: true },
      { code: "TOHSECRET", reward: "Free Modifier", active: true },
      { code: "RINGS2025", reward: "Free Rings", active: false },
    ]
  },
  "royale-high": {
    game: "Royale High",
    icon: "👑",
    slug: "royale-high",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Royale High on Roblox",
      "Click on any Fountain in the game",
      "Select the Redeem Codes option",
      "Enter your code and click Redeem",
    ],
    codes: [
      { code: "ROYALE2026", reward: "Free Diamonds", active: true },
      { code: "HALO2026", reward: "Free Diamonds", active: true },
      { code: "SPRING2025", reward: "Free Diamonds", active: false },
      { code: "WINTER2025", reward: "Free Diamonds", active: false },
    ]
  },
  "doors": {
    game: "Doors",
    icon: "🚪",
    slug: "doors",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Doors on Roblox",
      "Click the Shop icon on the main menu",
      "Select Redeem Code",
      "Type the code and press Enter",
    ],
    codes: [
      { code: "DOORS2026", reward: "Free Knobs", active: true },
      { code: "SURVIVE", reward: "Free Knobs", active: true },
      { code: "ENTITY", reward: "Free Knobs", active: false },
    ]
  },
  "arsenal": {
    game: "Arsenal",
    icon: "🎯",
    slug: "arsenal",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Arsenal on Roblox",
      "Click the Codes button on the main menu",
      "Enter the code in the text box",
      "Press Redeem to claim your reward",
    ],
    codes: [
      { code: "ARSENAL2026", reward: "Free Skin", active: true },
      { code: "HEADSHOT", reward: "Free Bucks", active: true },
      { code: "SPOOKYSZN", reward: "Free Skin", active: false },
    ]
  },
  "anime-fighting-simulator": {
    game: "Anime Fighting Simulator",
    icon: "🥊",
    slug: "anime-fighting-simulator",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Anime Fighting Simulator on Roblox",
      "Click the Codes button on the left side of the screen",
      "Enter the code exactly as shown",
      "Press Enter to redeem",
    ],
    codes: [
      { code: "ANIME2026", reward: "Free Chikara Shards", active: true },
      { code: "POWERUP", reward: "Free Yen", active: true },
      { code: "SWORDSMASTER", reward: "Free Chikara Shards", active: false },
    ]
  },
  "berry-avenue": {
    game: "Berry Avenue",
    icon: "🍓",
    slug: "berry-avenue",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Berry Avenue on Roblox",
      "Click the Twitter/Codes button in the menu",
      "Type your code in the text field",
      "Click Redeem to claim your reward",
    ],
    codes: [
      { code: "BERRY2026", reward: "Free Item", active: true },
      { code: "AVENUE", reward: "Free Cash", active: true },
      { code: "SUMMER2025", reward: "Free Item", active: false },
    ]
  },
  "livetopia": {
    game: "Livetopia",
    icon: "🏖️",
    slug: "livetopia",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Livetopia on Roblox",
      "Click the Codes button in the main menu",
      "Enter the code in the text box",
      "Press Redeem to claim your free reward",
    ],
    codes: [
      { code: "LIVETOPIA2026", reward: "Free Coins", active: true },
      { code: "PARADISE", reward: "Free Item", active: true },
      { code: "BEACH2025", reward: "Free Coins", active: false },
    ]
  },
  "natural-disaster-survival": {
    game: "Natural Disaster Survival",
    icon: "🌪️",
    slug: "natural-disaster-survival",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Natural Disaster Survival on Roblox",
      "Click the Settings or Menu button",
      "Look for the Codes option",
      "Enter your code and press Redeem",
    ],
    codes: [
      { code: "SURVIVE2026", reward: "Free Badge", active: true },
      { code: "DISASTER", reward: "Free Reward", active: true },
      { code: "TORNADO2025", reward: "Free Badge", active: false },
    ]
  },
  "anime-defenders": {
    game: "Anime Defenders",
    icon: "🐉",
    slug: "anime-defenders",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Anime Defenders on Roblox",
      "Click the Codes button on the main lobby screen",
      "Type the code exactly as shown",
      "Press Redeem to claim your gems and rewards",
    ],
    codes: [
      { code: "DEFENDERS2026", reward: "Free Gems", active: true },
      { code: "ANIME2026", reward: "Free Gems", active: true },
      { code: "SUMMON2025", reward: "Free Gems", active: false },
      { code: "EVOLUTION", reward: "Free Gems", active: false },
    ]
  },
  "funky-friday": {
    game: "Funky Friday",
    icon: "🎵",
    slug: "funky-friday",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Funky Friday on Roblox",
      "Click the Codes button on the main menu",
      "Enter the code in the text field",
      "Press Redeem to get your free points",
    ],
    codes: [
      { code: "FUNKY2026", reward: "Free Points", active: true },
      { code: "RHYTHM", reward: "Free Points", active: true },
      { code: "FRIDAY2025", reward: "Free Points", active: false },
    ]
  },
  "kick-off": {
    game: "Kick Off",
    icon: "⚽",
    slug: "kick-off",
    updatedAt: "March 4, 2026",
    redeemSteps: [
      "Open Kick Off on Roblox",
      "Click the Codes button in the main menu",
      "Enter your code in the text box",
      "Press Redeem to claim your reward",
    ],
    codes: [
      { code: "KICKOFF2026", reward: "Free Coins", active: true },
      { code: "GOAL2026", reward: "Free Coins", active: true },
      { code: "CHAMPION2025", reward: "Free Skin", active: false },
    ]
  },
};