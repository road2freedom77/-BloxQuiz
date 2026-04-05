import type { Metadata } from "next";
import { DuoPairCard } from "./DuoPairCard";

export const metadata: Metadata = {
  title: "Roblox Duo & Matching Names Generator — Best Friend Username Pairs | BloxQuiz",
  description: "Generate matching Roblox username pairs for you and your best friend. Pick a theme and get ready-to-copy duo name sets — aesthetic, anime, gaming, and more.",
  alternates: { canonical: "https://www.bloxquiz.gg/roblox-duo-names" },
  openGraph: {
    title: "Roblox Duo & Matching Names Generator | BloxQuiz",
    description: "Find the perfect matching Roblox username pair for you and your best friend.",
    url: "https://www.bloxquiz.gg/roblox-duo-names",
    siteName: "BloxQuiz",
    type: "website",
  },
};

const DUO_THEMES = [
  {
    theme: "Aesthetic",
    emoji: "🌸",
    pairs: [
      ["SoftPetal", "MoonDust"],
      ["CherryMist", "VelvetSkye"],
      ["PastelHaze", "CloudVeil"],
      ["FrostBloom", "DawnRose"],
      ["LunarPetal", "StarDust"],
      ["CrystalMist", "SilkGlow"],
      ["BlushDream", "LavenderHaze"],
      ["GlowPetal", "MoonVeil"],
    ],
  },
  {
    theme: "Anime",
    emoji: "⚔️",
    pairs: [
      ["ShinobiX", "KunoichiZ"],
      ["AkatsukiX", "SakuraBlade"],
      ["DemonSlayerX", "PillarsEdge"],
      ["NarutoRising", "SasukeFall"],
      ["BladeSoul", "FlameHeart"],
      ["ShadowRealm", "LightBlade"],
      ["DragonFist", "PhoenixKick"],
      ["SoulReaper", "BoneSword"],
    ],
  },
  {
    theme: "Gaming",
    emoji: "🎮",
    pairs: [
      ["Player1X", "Player2Z"],
      ["TeamAlphaX", "TeamBetaZ"],
      ["RespawnX", "ReviveZ"],
      ["LagSpikeX", "PacketLossZ"],
      ["NoScopeX", "QuickScopeZ"],
      ["GlitchHunter", "BugCatcher"],
      ["SpeedrunX", "AnyPercent"],
      ["CritHitX", "HeadshotZ"],
    ],
  },
  {
    theme: "Dark & Edgy",
    emoji: "🖤",
    pairs: [
      ["VoidWalker", "ShadowCrawler"],
      ["DarkRealmX", "AbyssZone"],
      ["NightHunter", "MoonStalker"],
      ["CursedSoul", "DamnedSpirit"],
      ["GrimReaperX", "DeathBringer"],
      ["BlackRoseX", "ThornBlade"],
      ["EclipseX", "DarknessZ"],
      ["SinnerX", "DemonZ"],
    ],
  },
  {
    theme: "Funny",
    emoji: "😂",
    pairs: [
      ["BurgerFlipX", "FryDropZ"],
      ["NoodleArmX", "WetSockZ"],
      ["TouchGrassX", "SkipShowerZ"],
      ["LaggingX", "DisconnectedZ"],
      ["AFK4Ever", "LoggedOut"],
      ["NoobMasterX", "NoobSlayerZ"],
      ["BotSuspectX", "HackerZ"],
      ["JustLostX", "AlsoLostZ"],
    ],
  },
  {
    theme: "Nature",
    emoji: "🌿",
    pairs: [
      ["OakRoots", "WillowBranch"],
      ["StormCloud", "ThunderRain"],
      ["RiverFlow", "OceanTide"],
      ["FireFly", "MoonGlow"],
      ["GoldenLeaf", "SilverBark"],
      ["MossRock", "FernGlade"],
      ["CrimsonSun", "AzureSkye"],
      ["CedarWind", "PineBreeze"],
    ],
  },
  {
    theme: "Space",
    emoji: "🚀",
    pairs: [
      ["OrbitX", "GravityZ"],
      ["NebulaDrift", "StarCluster"],
      ["CosmosX", "VoidZ"],
      ["BlackHoleX", "EventHorizon"],
      ["MarsColony", "LunarBase"],
      ["DarkMatterX", "AntimatterZ"],
      ["SolarFlareX", "CoronaZ"],
      ["WarpSpeedX", "HyperdriveZ"],
    ],
  },
  {
    theme: "Royalty",
    emoji: "👑",
    pairs: [
      ["KingSlayerX", "QueenRulerZ"],
      ["LordOfX", "LadyOfZ"],
      ["EmperorX", "EmpressZ"],
      ["PrinceX", "PrincessZ"],
      ["DukeX", "DuchessZ"],
      ["KnightX", "PaladinZ"],
      ["CrownX", "ScepterZ"],
      ["ThroneX", "RealmZ"],
    ],
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
            Find the perfect matching username pair for you and your best friend. Pick a theme and copy your favorites instantly.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: 100 }}>64 matching pairs</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: 100 }}>8 themes</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: 100 }}>Click to copy</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* How to use */}
        <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "18px 24px", marginBottom: 40 }}>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
            Browse the themes below, pick a pair you both like, and click either name to copy it. One of you takes the first name, the other takes the second — done.
          </p>
        </div>

        {/* Theme sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {DUO_THEMES.map((section) => (
            <div key={section.theme}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span>{section.emoji}</span>
                <span>{section.theme}</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                {section.pairs.map(([nameA, nameB], i) => (
                  <DuoPairCard key={i} nameA={nameA} nameB={nameB} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cross-links */}
        <div style={{ marginTop: 56, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 40 }}>
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
              <a
                key={link.href}
                href={link.href}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13 }}
              >
                <span>{link.emoji}</span><span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}