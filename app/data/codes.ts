export const codesData: Record<string, {
    game: string;
    icon: string;
    slug: string;
    updatedAt: string;
    codes: { code: string; reward: string; active: boolean }[];
  }> = {
    "blox-fruits": {
      game: "Blox Fruits",
      icon: "⚔️",
      slug: "blox-fruits",
      updatedAt: "March 1, 2026",
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
      updatedAt: "March 1, 2026",
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
      updatedAt: "March 1, 2026",
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
      updatedAt: "March 1, 2026",
      codes: [
        { code: "GARDEN2026", reward: "Free Seeds", active: true },
        { code: "SPROUT", reward: "Free Fertilizer", active: true },
        { code: "HARVEST", reward: "Free Tools", active: true },
        { code: "BLOOM2025", reward: "Free Seeds", active: false },
      ]
    },
    "brookhaven": {
      game: "Brookhaven RP",
      icon: "🏘️",
      slug: "brookhaven",
      updatedAt: "March 1, 2026",
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
      updatedAt: "March 1, 2026",
      codes: [
        { code: "FLIGHTMODE", reward: "Free Modifier", active: true },
        { code: "TOHSECRET", reward: "Free Modifier", active: true },
        { code: "RINGS2025", reward: "Free Rings", active: false },
      ]
    },
  };