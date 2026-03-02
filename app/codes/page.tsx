import { codesData } from "../data/codes";

export const metadata = {
  title: "Roblox Codes 2026 — All Active Codes | BloxQuiz",
  description: "All active Roblox codes for 2026. Blox Fruits, Adopt Me, Murder Mystery 2, Grow a Garden, Brookhaven and more. Updated daily!",
  alternates: { canonical: "https://www.bloxquiz.gg/codes" }
};

export default function CodesPage() {
  const games = Object.values(codesData);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", marginBottom: 12 }}>
          {"🎁 Roblox Codes 2026"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
          All active codes for the most popular Roblox games. Updated daily — bookmark this page!
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {games.map(game => {
          const activeCodes = game.codes.filter(c => c.active);
          return (
            <a key={game.slug} href={`/codes/${game.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, cursor: "pointer", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{game.icon}</span>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 2 }}>{game.game}</h2>
                    <div style={{ fontSize: 12, color: "var(--neon-green)", fontWeight: 800 }}>
                      {"✅ " + activeCodes.length + " Active Codes"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {activeCodes.slice(0, 3).map(c => (
                    <div key={c.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", borderRadius: 8, padding: "8px 12px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--neon-green)", letterSpacing: 0.5 }}>{c.code}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{c.reward}</span>
                    </div>
                  ))}
                  {activeCodes.length > 3 && (
                    <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700, textAlign: "center", paddingTop: 4 }}>
                      {"+" + (activeCodes.length - 3) + " more codes →"}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>
                  {"Updated " + game.updatedAt}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}