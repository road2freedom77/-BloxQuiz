import type { Metadata } from "next";
import DuoNamesClient from "./DuoNamesClient";

export const metadata: Metadata = {
  title: "Roblox Duo & Matching Names Generator (2026) — 160+ Best Friend Username Pairs | BloxQuiz",
  description: "Find matching Roblox username pairs for you and your best friend. 160+ duo name ideas across 8 themes — aesthetic, anime, gaming, funny, dark, nature, space, and royalty. Click to copy instantly.",
  alternates: { canonical: "https://www.bloxquiz.gg/roblox-duo-names" },
  openGraph: {
    title: "Roblox Duo & Matching Names Generator | BloxQuiz",
    description: "160+ matching Roblox username pairs for best friends. Filter by theme and style, copy both names instantly.",
    url: "https://www.bloxquiz.gg/roblox-duo-names",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export interface DuoPair {
  nameA: string;
  nameB: string;
  style: "cute" | "tryhard" | "funny" | "clean";
}

export interface DuoTheme {
  theme: string;
  emoji: string;
  intro: string;
  pairs: DuoPair[];
}

export const DUO_THEMES: DuoTheme[] = [
  {
    theme: "Aesthetic",
    emoji: "🌸",
    intro: "Soft, dreamy username pairs for players who want their names to feel cohesive and visually calming. Works great for roleplay servers and fashion games like Dress to Impress.",
    pairs: [
      { nameA: "SoftPetal", nameB: "MoonDust", style: "cute" },
      { nameA: "CherryMist", nameB: "VelvetSkye", style: "cute" },
      { nameA: "PastelHaze", nameB: "CloudVeil", style: "cute" },
      { nameA: "FrostBloom", nameB: "DawnRose", style: "cute" },
      { nameA: "LunarPetal", nameB: "StarDust", style: "cute" },
      { nameA: "CrystalMist", nameB: "SilkGlow", style: "cute" },
      { nameA: "BlushDream", nameB: "LavenderHaze", style: "cute" },
      { nameA: "GlowPetal", nameB: "MoonVeil", style: "cute" },
      { nameA: "IvoryWave", nameB: "PearlDrift", style: "cute" },
      { nameA: "RoseEther", nameB: "VioletMist", style: "cute" },
    ],
  },
  {
    theme: "Anime",
    emoji: "⚔️",
    intro: "Battle-ready duo names inspired by anime games on Roblox. Perfect for Blox Fruits, Jujutsu Infinite, Anime Vanguards, and any game where your duo needs to sound legendary.",
    pairs: [
      { nameA: "ShinobiX", nameB: "KunoichiZ", style: "tryhard" },
      { nameA: "AkatsukiX", nameB: "SakuraBlade", style: "tryhard" },
      { nameA: "DemonSlayerX", nameB: "PillarsEdge", style: "tryhard" },
      { nameA: "NarutoRising", nameB: "SasukeFall", style: "tryhard" },
      { nameA: "BladeSoul", nameB: "FlameHeart", style: "tryhard" },
      { nameA: "ShadowRealm", nameB: "LightBlade", style: "tryhard" },
      { nameA: "DragonFist", nameB: "PhoenixKick", style: "tryhard" },
      { nameA: "SoulReaper", nameB: "BoneSword", style: "tryhard" },
      { nameA: "StormKatana", nameB: "ThunderBlade", style: "tryhard" },
      { nameA: "VoidSamurai", nameB: "FlameShinobi", style: "tryhard" },
    ],
  },
  {
    theme: "Gaming",
    emoji: "🎮",
    intro: "Classic gamer duo names that work across any Roblox game. These pairs lean into gaming culture — respawns, lag, clutch plays, and competitive energy.",
    pairs: [
      { nameA: "Player1X", nameB: "Player2Z", style: "funny" },
      { nameA: "TeamAlphaX", nameB: "TeamBetaZ", style: "clean" },
      { nameA: "RespawnX", nameB: "ReviveZ", style: "clean" },
      { nameA: "LagSpikeX", nameB: "PacketLossZ", style: "funny" },
      { nameA: "NoScopeX", nameB: "QuickScopeZ", style: "tryhard" },
      { nameA: "GlitchHunter", nameB: "BugCatcher", style: "funny" },
      { nameA: "SpeedrunX", nameB: "AnyPercent", style: "tryhard" },
      { nameA: "CritHitX", nameB: "HeadshotZ", style: "tryhard" },
      { nameA: "ClutchX", nameB: "CarryZ", style: "tryhard" },
      { nameA: "GG_Always", nameB: "EZ_Always", style: "funny" },
    ],
  },
  {
    theme: "Dark & Edgy",
    emoji: "🖤",
    intro: "Dark, moody username pairs for the duo that takes their Roblox aesthetic seriously. Popular in horror games like Doors and Forsaken, and any PvP game where intimidation is part of the vibe.",
    pairs: [
      { nameA: "VoidWalker", nameB: "ShadowCrawler", style: "tryhard" },
      { nameA: "DarkRealmX", nameB: "AbyssZone", style: "tryhard" },
      { nameA: "NightHunter", nameB: "MoonStalker", style: "tryhard" },
      { nameA: "CursedSoul", nameB: "DamnedSpirit", style: "tryhard" },
      { nameA: "GrimReaperX", nameB: "DeathBringer", style: "tryhard" },
      { nameA: "BlackRoseX", nameB: "ThornBlade", style: "tryhard" },
      { nameA: "EclipseX", nameB: "DarknessZ", style: "tryhard" },
      { nameA: "SinnerX", nameB: "DemonZ", style: "tryhard" },
      { nameA: "ObsidianX", nameB: "AshenZ", style: "clean" },
      { nameA: "NullVoid", nameB: "DeadSignal", style: "clean" },
    ],
  },
  {
    theme: "Funny",
    emoji: "😂",
    intro: "Duo names designed to make people laugh in the lobby. These pairs work anywhere — the joke lands whether you're playing Adopt Me or Murder Mystery 2.",
    pairs: [
      { nameA: "BurgerFlipX", nameB: "FryDropZ", style: "funny" },
      { nameA: "NoodleArmX", nameB: "WetSockZ", style: "funny" },
      { nameA: "TouchGrassX", nameB: "SkipShowerZ", style: "funny" },
      { nameA: "LaggingX", nameB: "DisconnectedZ", style: "funny" },
      { nameA: "AFK4Ever", nameB: "LoggedOut", style: "funny" },
      { nameA: "NoobMasterX", nameB: "NoobSlayerZ", style: "funny" },
      { nameA: "BotSuspectX", nameB: "HackerZ", style: "funny" },
      { nameA: "JustLostX", nameB: "AlsoLostZ", style: "funny" },
      { nameA: "SkippedTutorial", nameB: "ReadTheGuide", style: "funny" },
      { nameA: "CriedIRL", nameB: "LaughedIRL", style: "funny" },
    ],
  },
  {
    theme: "Nature",
    emoji: "🌿",
    intro: "Calm, earthy username pairs drawn from natural elements. A good fit for Grow a Garden, Bee Swarm Simulator, or any game where you want names that feel grounded rather than aggressive.",
    pairs: [
      { nameA: "OakRoots", nameB: "WillowBranch", style: "clean" },
      { nameA: "StormCloud", nameB: "ThunderRain", style: "clean" },
      { nameA: "RiverFlow", nameB: "OceanTide", style: "clean" },
      { nameA: "FireFly", nameB: "MoonGlow", style: "cute" },
      { nameA: "GoldenLeaf", nameB: "SilverBark", style: "clean" },
      { nameA: "MossRock", nameB: "FernGlade", style: "clean" },
      { nameA: "CrimsonSun", nameB: "AzureSkye", style: "cute" },
      { nameA: "CedarWind", nameB: "PineBreeze", style: "clean" },
      { nameA: "TidalWave", nameB: "SeaFoam", style: "clean" },
      { nameA: "EmberGlow", nameB: "AshDrift", style: "cute" },
    ],
  },
  {
    theme: "Space",
    emoji: "🚀",
    intro: "Cosmic username pairs for the duo that thinks big. These work especially well in sci-fi adjacent games and any game where you want your names to sound epic without being aggressive.",
    pairs: [
      { nameA: "OrbitX", nameB: "GravityZ", style: "clean" },
      { nameA: "NebulaDrift", nameB: "StarCluster", style: "clean" },
      { nameA: "CosmosX", nameB: "VoidZ", style: "tryhard" },
      { nameA: "BlackHoleX", nameB: "EventHorizon", style: "tryhard" },
      { nameA: "MarsColony", nameB: "LunarBase", style: "clean" },
      { nameA: "DarkMatterX", nameB: "AntimatterZ", style: "tryhard" },
      { nameA: "SolarFlareX", nameB: "CoronaZ", style: "tryhard" },
      { nameA: "WarpSpeedX", nameB: "HyperdriveZ", style: "tryhard" },
      { nameA: "StarlightX", nameB: "CometTailZ", style: "cute" },
      { nameA: "PulsarX", nameB: "QuasarZ", style: "clean" },
    ],
  },
  {
    theme: "Royalty",
    emoji: "👑",
    intro: "Regal duo names for players who want to feel like they own the server. These pairs work across roleplay, RPGs, and any game where hierarchy matters.",
    pairs: [
      { nameA: "KingSlayerX", nameB: "QueenRulerZ", style: "tryhard" },
      { nameA: "LordOfX", nameB: "LadyOfZ", style: "clean" },
      { nameA: "EmperorX", nameB: "EmpressZ", style: "clean" },
      { nameA: "PrinceX", nameB: "PrincessZ", style: "cute" },
      { nameA: "DukeX", nameB: "DuchessZ", style: "clean" },
      { nameA: "KnightX", nameB: "PaladinZ", style: "tryhard" },
      { nameA: "CrownX", nameB: "ScepterZ", style: "clean" },
      { nameA: "ThroneX", nameB: "RealmZ", style: "clean" },
      { nameA: "SovereignX", nameB: "RegentZ", style: "clean" },
      { nameA: "NobleX", nameB: "GentryZ", style: "cute" },
    ],
  },
];

const FAQ = [
  {
    q: "Can I use these names directly on Roblox?",
    a: "Yes — all pairs are designed to fit within Roblox's 20-character username limit. Click any name to copy it and paste it directly into Roblox's username field. Note that availability depends on whether another user has already taken that name.",
  },
  {
    q: "What are Roblox's username rules?",
    a: "Roblox usernames must be 3–20 characters, can include letters, numbers, and underscores, and cannot contain spaces or special characters. They also cannot include offensive language or impersonate other users.",
  },
  {
    q: "How do matching duo names work on Roblox?",
    a: "You and your friend each register one name from the pair. Since Roblox doesn't have a built-in couples/duo name feature, you just agree on a pair and claim your names separately. When you play together, your names will visually match in the lobby.",
  },
  {
    q: "What if my favorite pair is already taken?",
    a: "Try adding numbers or underscores to the name — for example SoftPetal_ or SoftPetal2. You can also browse similar names in the same theme for alternatives with the same vibe.",
  },
  {
    q: "What games are these duo names best for?",
    a: "Aesthetic pairs work well in Dress to Impress, Brookhaven RP, and Berry Avenue. Anime pairs suit Blox Fruits, Jujutsu Infinite, and Anime Vanguards. Gaming and Funny pairs work everywhere. Dark & Edgy pairs fit horror games like Doors and Forsaken.",
  },
];

export default function DuoNamesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #0f0f23 0%, #0a0a14 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "56px 0 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, margin: "0 0 14px", lineHeight: 1.1 }}>
            Roblox Duo & Matching Names Generator
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "0 auto", maxWidth: 520, lineHeight: 1.7 }}>
            Find the perfect matching username pair for you and your best friend. Filter by theme and style, then copy your favorites instantly.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
            {["160+ matching pairs", "8 themes", "4 styles", "Click to copy"].map(tag => (
              <span key={tag} style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: 100 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive client section */}
      <DuoNamesClient themes={DUO_THEMES} />

      {/* FAQ — server rendered for SEO */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 48, marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 24 }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((faq, i) => (
              <div key={i} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontWeight: 600 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Naming rules note */}
        <div style={{ background: "rgba(0,180,216,0.06)", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 12, padding: "18px 24px", marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#00b4d8", marginBottom: 8 }}>📋 Roblox Username Rules</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontWeight: 600 }}>
            Usernames must be <strong style={{ color: "#fff" }}>3–20 characters</strong>, letters/numbers/underscores only, no spaces or special characters. All names on this page are designed to fit within the limit — the character count is shown on each pair.
          </div>
        </div>

        {/* Cross-links */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", marginBottom: 16, textAlign: "center" }}>
            More Roblox Tools
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {[
              { href: "/tools", label: "All Tools", emoji: "🛠️" },
              { href: "/roblox-username-ideas", label: "Username Ideas", emoji: "👤" },
              { href: "/roblox-display-name-generator", label: "Display Name Generator", emoji: "✨" },
              { href: "/roblox-bio-generator", label: "Bio Generator", emoji: "✍️" },
              { href: "/roblox-group-name-generator", label: "Group Name Generator", emoji: "🏰" },
              { href: "/what-roblox-game-should-i-play", label: "Game Finder", emoji: "🎮" },
            ].map((link) => (
              <a key={link.href} href={link.href} style={{ display: "flex", alignItems: "center", gap: 8, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13 }}>
                <span>{link.emoji}</span><span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}