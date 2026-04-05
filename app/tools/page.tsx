import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roblox Tools — Game Finder, Username Ideas & More | BloxQuiz",
  description: "Free Roblox tools to help you find your next game, generate better usernames, write a stronger bio, and build the perfect group. Updated with live player data.",
  alternates: { canonical: "https://www.bloxquiz.gg/tools" },
  openGraph: {
    title: "Roblox Tools | BloxQuiz",
    description: "Free Roblox tools for every player — game finder, username generator, bio creator, group name generator, and more.",
    url: "https://www.bloxquiz.gg/tools",
    siteName: "BloxQuiz",
    type: "website",
  },
};

const TOOLS = [
  {
    href: "/what-roblox-game-should-i-play",
    emoji: "🎮",
    label: "What Roblox Game Should I Play?",
    description: "Not sure what to play? Pick your vibe and get 3 personalized Roblox game picks with live player counts and fresh recommendations.",
    cta: "Find Your Game",
    badge: "🔥 Popular",
    meta: "Live player counts · Updated hourly",
    highlight: true,
  },
  {
    href: "/roblox-username-ideas",
    emoji: "👤",
    label: "Roblox Username Ideas",
    description: "Browse 1,100+ Roblox username ideas across 10 categories. Search by style, filter fast, and copy your favorites instantly.",
    cta: "Browse Usernames",
    badge: null,
    meta: "1,100+ ideas · 10 categories",
    highlight: false,
  },
  {
    href: "/roblox-display-name-generator",
    emoji: "✨",
    label: "Display Name Generator",
    description: "Generate creative Roblox display names based on your vibe — aesthetic, funny, cool, tryhard, and more.",
    cta: "Generate Display Names",
    badge: null,
    meta: "7 styles · Instant results",
    highlight: false,
  },
  {
    href: "/roblox-bio-generator",
    emoji: "✍️",
    label: "Bio Generator",
    description: "Create the perfect Roblox profile bio in seconds. Pick your style and copy ready-to-use bios for your profile.",
    cta: "Generate a Bio",
    badge: null,
    meta: "140+ bios · Ready to copy",
    highlight: false,
  },
  {
    href: "/roblox-group-name-generator",
    emoji: "🏰",
    label: "Group Name Generator",
    description: "Find the perfect Roblox group name with 400+ ideas across 8 categories, including clans, roleplay, military, anime, and more.",
    cta: "Generate Group Names",
    badge: null,
    meta: "400+ names · 8 categories",
    highlight: false,
  },
  {
    href: "/roblox-duo-names",
    emoji: "👥",
    label: "Duo & Matching Names Generator",
    description: "Generate matching Roblox username pairs for you and your best friend. Pick a theme and get ready-to-use duo name sets.",
    cta: "Generate Duo Names",
    badge: "✨ New",
    meta: "Matching pairs · Multiple themes",
    highlight: false,
  },
];

const MORE_LINKS = [
  { href: "/stats/most-played", label: "Most Played Games", emoji: "🎮" },
  { href: "/stats/trending", label: "Trending Right Now", emoji: "📈" },
  { href: "/codes", label: "Active Roblox Codes", emoji: "🎁" },
  { href: "/stats", label: "Live Game Stats", emoji: "📊" },
  { href: "/browse", label: "All Roblox Quizzes", emoji: "🧠" },
  { href: "/leaderboard", label: "Leaderboard", emoji: "🏆" },
];

export default function ToolsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #0f0f23 0%, #0a0a14 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "56px 0 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛠️</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, margin: "0 0 14px", lineHeight: 1.1 }}>
            Roblox Tools
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "0 auto", maxWidth: 540, lineHeight: 1.7 }}>
            Free Roblox tools to help you find your next game, generate better usernames, write a stronger bio, and build the perfect group.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Tools grid — 3 cols, 2 rows = clean 6-card layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 56 }}>
          {TOOLS.map((tool) => (
            <a key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: tool.highlight ? "linear-gradient(135deg, #0f1629 0%, #111827 100%)" : "#111827",
                border: tool.highlight ? "1px solid rgba(0,180,216,0.3)" : "1px solid rgba(255,255,255,0.07)",
                borderLeft: tool.highlight ? "3px solid #00b4d8" : undefined,
                borderRadius: 16,
                padding: "24px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 0,
                cursor: "pointer",
              }}>

                {/* Top: emoji + badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 36 }}>{tool.emoji}</div>
                  {tool.badge && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: tool.highlight ? "rgba(0,180,216,0.15)" : "rgba(255,255,255,0.08)",
                      color: tool.highlight ? "#00b4d8" : "rgba(255,255,255,0.6)",
                      border: tool.highlight ? "1px solid rgba(0,180,216,0.3)" : "1px solid rgba(255,255,255,0.12)",
                      whiteSpace: "nowrap",
                    }}>
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title — fixed 2-line space */}
                <div style={{ fontSize: 15, fontWeight: 800, color: tool.highlight ? "#00b4d8" : "#fff", lineHeight: 1.3, marginBottom: 10, minHeight: 40 }}>
                  {tool.label}
                </div>

                {/* Description — fixed 3-line space */}
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 600, lineHeight: 1.6, marginBottom: 12, minHeight: 60 }}>
                  {tool.description}
                </div>

                {/* Meta badge */}
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>
                  {tool.meta}
                </div>

                {/* CTA — anchored to bottom */}
                <div style={{ marginTop: "auto" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: tool.highlight ? "linear-gradient(135deg, #00b4d8, #0077b6)" : "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 13,
                    padding: "8px 18px",
                    borderRadius: 100,
                  }}>
                    {tool.cta} →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* More to Explore */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", marginBottom: 16, textAlign: "center" }}>
            More to Explore
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {MORE_LINKS.map((link) => (
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