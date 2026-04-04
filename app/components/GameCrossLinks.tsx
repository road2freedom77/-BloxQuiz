// components/GameCrossLinks.tsx
interface GameCrossLinksProps {
  slug: string;
  gameName: string;
  hasQuizzes?: boolean;
  hasCodes?: boolean;
  hasStats?: boolean;
  activeTab?: "quiz" | "codes" | "stats";
}

export default function GameCrossLinks({
  slug,
  gameName,
  hasQuizzes = true,
  hasCodes = true,
  hasStats = true,
  activeTab,
}: GameCrossLinksProps) {
  const links = [
    {
      key: "quiz",
      href: `/games/${slug}`,
      emoji: "🧠",
      label: "Quizzes",
      desc: `Test your ${gameName} knowledge`,
      color: "var(--neon-green)",
      bg: "rgba(0,245,160,0.08)",
      border: "rgba(0,245,160,0.2)",
      show: hasQuizzes,
    },
    {
      key: "codes",
      href: `/codes/${slug}`,
      emoji: "🎁",
      label: "Codes",
      desc: `Free ${gameName} codes`,
      color: "var(--neon-yellow)",
      bg: "rgba(255,227,71,0.08)",
      border: "rgba(255,227,71,0.2)",
      show: hasCodes,
    },
    {
      key: "stats",
      href: `/stats/${slug}`,
      emoji: "📊",
      label: "Live Stats",
      desc: `${gameName} player count`,
      color: "#00b4d8",
      bg: "rgba(0,180,216,0.08)",
      border: "rgba(0,180,216,0.2)",
      show: hasStats,
    },
  ].filter((l) => l.show);

  if (links.length === 0) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 10 }}>
        {gameName} on BloxQuiz
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {links.map((link) => {
          const isActive = activeTab === link.key;
          return (
            <a
              key={link.key}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 18px",
                borderRadius: 12,
                textDecoration: "none",
                background: isActive ? link.bg : "var(--bg-card)",
                border: `1px solid ${isActive ? link.border : "var(--border)"}`,
                width: "auto",
                opacity: isActive ? 1 : 0.85,
                transition: "opacity 0.15s",
                cursor: isActive ? "default" : "pointer",
                pointerEvents: isActive ? "none" : "auto",
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{link.emoji}</span>
              <div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: isActive ? link.color : "var(--text)",
                  marginBottom: 2,
                  whiteSpace: "nowrap",
                }}>
                  {link.label}
                  {isActive && (
                    <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: link.color, opacity: 0.8 }}>← here</span>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", whiteSpace: "nowrap" }}>{link.desc}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}