// components/RobuxCTA.tsx

const DEFAULT_URL = "https://www.amazon.com/s?k=roblox+phatmojo+figures+dlc&tag=bloxquiz-20";

const GAME_AFFILIATE: Record<string, { url: string; teaser: string }> = {
  "Blox Fruits": {
    url: "https://www.amazon.com/s?k=blox+fruits+phatmojo+dlc&tag=bloxquiz-20",
    teaser: "Official figures include redeemable in-game DLC codes",
  },
  "Adopt Me": {
    url: "https://www.amazon.com/s?k=adopt+me+roblox+toys&tag=bloxquiz-20",
    teaser: "Official Adopt Me toys & plush on Amazon",
  },
  "Brookhaven RP": {
    url: "https://www.amazon.com/s?k=roblox+figures+phatmojo&tag=bloxquiz-20",
    teaser: "Official Roblox figures & merch on Amazon",
  },
  "Rivals": {
    url: "https://www.amazon.com/s?k=roblox+figures+phatmojo&tag=bloxquiz-20",
    teaser: "Official Roblox figures & merch on Amazon",
  },
  "Dandy's World": {
    url: "https://www.amazon.com/s?k=roblox+figures+phatmojo&tag=bloxquiz-20",
    teaser: "Official Roblox figures & merch on Amazon",
  },
};

const DEFAULT_TEASER = "Official figures include redeemable in-game DLC codes";

function getAffiliate(game?: string): { url: string; teaser: string } {
  if (!game) return { url: DEFAULT_URL, teaser: DEFAULT_TEASER };
  return GAME_AFFILIATE[game] ?? { url: DEFAULT_URL, teaser: DEFAULT_TEASER };
}

export default function RobuxCTA({
  variant = "default",
  game,
}: {
  variant?: "default" | "compact" | "card" | "banner";
  game?: string;
}) {
  const { url, teaser } = getAffiliate(game);
  const headline = game ? `Get ${game} figures + DLC codes` : "Get Roblox figures + DLC codes";

  if (variant === "banner") {
    return (
      <a
        href={url}
        target="_blank"
        rel="nofollow sponsored noopener"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background:
            "linear-gradient(90deg, rgba(255,227,71,0.08), rgba(184,76,255,0.06), rgba(255,227,71,0.08))",
          borderTop: "1px solid rgba(255,227,71,0.15)",
          borderBottom: "1px solid rgba(255,227,71,0.15)",
          padding: "10px 20px",
          textDecoration: "none",
          width: "100%",
        }}
      >
        <span style={{ fontSize: 16 }}>🎁</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
          {game ? `${game} fan?` : "Roblox fan?"}{" "}
          <span style={{ color: "var(--neon-yellow)", fontWeight: 900 }}>
            {headline} on Amazon
          </span>
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: "var(--neon-yellow)",
            whiteSpace: "nowrap",
          }}
        >
          Shop Now →
        </span>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={url}
        target="_blank"
        rel="nofollow sponsored noopener"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,227,71,0.1)",
          border: "1px solid rgba(255,227,71,0.25)",
          borderRadius: 100,
          padding: "8px 18px",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 800,
          color: "var(--neon-yellow)",
        }}
      >
        🎁 {headline} →
      </a>
    );
  }

  if (variant === "card") {
    return (
      <a
        href={url}
        target="_blank"
        rel="nofollow sponsored noopener"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background:
            "linear-gradient(135deg, rgba(255,227,71,0.08), rgba(184,76,255,0.06))",
          border: "1px solid rgba(255,227,71,0.2)",
          borderRadius: "var(--radius)",
          padding: "16px 20px",
          textDecoration: "none",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: "var(--neon-yellow)",
              marginBottom: 2,
            }}
          >
            🎁 {headline}
          </div>
          <div
            style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}
          >
            {teaser}
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: "var(--neon-yellow)",
            whiteSpace: "nowrap",
          }}
        >
          Shop Amazon →
        </span>
      </a>
    );
  }

  // default
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(255,227,71,0.08), rgba(184,76,255,0.06))",
        border: "1px solid rgba(255,227,71,0.2)",
        borderRadius: "var(--radius)",
        padding: "20px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 900,
          color: "var(--neon-yellow)",
          marginBottom: 6,
        }}
      >
        🎁 {headline}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          fontWeight: 600,
          marginBottom: 14,
        }}
      >
        {teaser}
      </div>
      <a
        href={url}
        target="_blank"
        rel="nofollow sponsored noopener"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "linear-gradient(135deg, #FFE347, #FFB347)",
          color: "#0B0E17",
          fontWeight: 900,
          fontSize: 14,
          padding: "10px 24px",
          borderRadius: 100,
          textDecoration: "none",
          WebkitTextFillColor: "#0B0E17",
        }}
      >
        🛒 Shop on Amazon
      </a>
      <div
        style={{
          fontSize: 11,
          color: "var(--text-dim)",
          fontWeight: 600,
          marginTop: 8,
        }}
      >
        Via Amazon · Affiliate link
      </div>
    </div>
  );
}