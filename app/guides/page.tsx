import { supabaseAdmin } from "../lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Roblox Game Guides (2026) — Beginner Tips, Strategies & How-To | BloxQuiz",
  description: "Free Roblox game guides for Blox Fruits, Doors, Murder Mystery 2, Bee Swarm Simulator, Dress to Impress and more. Beginner tips, strategies, and progression paths.",
  alternates: { canonical: "https://www.bloxquiz.gg/guides" },
  openGraph: {
    title: "Roblox Game Guides (2026) | BloxQuiz",
    description: "Free beginner guides for the most popular Roblox games. Tips, strategies, and progression paths from the BloxQuiz editorial team.",
    url: "https://www.bloxquiz.gg/guides",
    siteName: "BloxQuiz",
    type: "website",
  },
};

function stripGameName(title: string, gameName: string): string {
  return title
    .replace(new RegExp(`^${gameName}[!]?\\s*`, "i"), "")
    .trim();
}

export default async function GuidesHubPage() {
  const { data: guides } = await supabaseAdmin
    .from("game_guides")
    .select("slug, title, game_name, game_slug, difficulty, excerpt, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const allGuides = guides ?? [];
  const guideCount = allGuides.length;

  // Most recently updated guide date for hub freshness signal
  const lastReviewed = allGuides.length > 0
    ? new Date(allGuides[0].updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "April 2026";

  const diffColor: Record<string, string> = {
    Beginner: "#00f5a0",
    Intermediate: "#ffd700",
    Advanced: "#ff3cac",
  };

  const gameEmoji: Record<string, string> = {
    "blox-fruits": "⚔️",
    "dress-to-impress": "👗",
    "bee-swarm-simulator": "🐝",
    "doors": "🚪",
    "murder-mystery-2": "🔫",
    "adopt-me": "🐾",
    "brookhaven-rp": "🏠",
    "royale-high": "👑",
    "grow-a-garden": "🌱",
    "tower-of-hell": "🏗️",
    "arsenal": "🔫",
    "berry-avenue": "🏙️",
    "anime-defenders": "⚡",
    "da-hood": "🎯",
    "fisch": "🎣",
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>Roblox Guides</span>
      </nav>

      {/* Hero */}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", marginBottom: 12, lineHeight: 1.1 }}>
        📖 Roblox Game Guides (2026)
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 720, marginBottom: 16 }}>
        Free beginner guides for the most popular Roblox games. Each guide covers getting started, key mechanics, best strategies, common mistakes, and a clear progression path. Written and reviewed by the BloxQuiz editorial team.
      </p>
      <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 40 }}>
        {guideCount} {guideCount === 1 ? "guide" : "guides"} available · Last reviewed {lastReviewed} · <a href="/editorial" style={{ color: "var(--text-dim)" }}>Editorial Standards</a>
      </div>

      {/* Guides grid */}
      {allGuides.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "48px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
            Guides are coming soon. Check back shortly.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, marginBottom: 48 }}>
          {allGuides.map((guide: any) => {
            const emoji = gameEmoji[guide.game_slug] || "🎮";
            const lastUpdated = new Date(guide.updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
            const cardTitle = stripGameName(guide.title, guide.game_name);
            return (
              <a
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                style={{ display: "flex", flexDirection: "column", background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 16, padding: "24px", textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 28 }}>{emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{guide.game_name}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: `${diffColor[guide.difficulty] || "#fff"}20`, color: diffColor[guide.difficulty] || "#fff", border: `1px solid ${diffColor[guide.difficulty] || "#fff"}40` }}>
                    {guide.difficulty} Guide
                  </span>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", marginBottom: 10, lineHeight: 1.3 }}>
                  {cardTitle}
                </h2>
                {guide.excerpt && (
                  <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                    {guide.excerpt.substring(0, 120)}...
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>Updated {lastUpdated}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#00b4d8" }}>Read Guide →</span>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* What these guides cover */}
      <div style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 14, padding: "28px 32px", marginBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>What These Guides Cover</h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, marginBottom: 20 }}>
          Every BloxQuiz guide is researched using current game wikis, community knowledge, and direct gameplay testing. Guides are reviewed for factual accuracy before publication and updated when major patches change core mechanics.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { emoji: "🚀", label: "Getting Started", desc: "What to do in your first session" },
            { emoji: "⚙️", label: "Key Mechanics", desc: "The systems you need to understand" },
            { emoji: "📈", label: "Progression Path", desc: "A clear roadmap for new players" },
            { emoji: "❌", label: "Common Mistakes", desc: "What to avoid so you don't waste time" },
            { emoji: "💡", label: "Pro Tips", desc: "Practical advice from experienced players" },
            { emoji: "❓", label: "FAQs", desc: "Answers to the most common questions" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-links */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>🧠 All Quizzes</a>
        <a href="/codes" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>🎁 Roblox Codes</a>
        <a href="/stats" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>📊 Live Stats</a>
      </div>
    </div>
  );
}