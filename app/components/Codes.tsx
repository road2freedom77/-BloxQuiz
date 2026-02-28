export default function Codes() {
    const codes = [
      { icon: "⚔️", game: "Blox Fruits Codes", count: 5, updated: "2 hours ago" },
      { icon: "🐾", game: "Adopt Me! Codes", count: 3, updated: "5 hours ago" },
      { icon: "🌱", game: "Grow a Garden Codes", count: 8, updated: "1 hour ago" },
      { icon: "🔫", game: "Murder Mystery 2 Codes", count: 4, updated: "3 hours ago" },
    ];
  
    return (
      <div id="codes" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>🎁 Latest Roblox Codes</h2>
          <a href="#" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>View All Codes →</a>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {codes.map((code) => (
            <div key={code.game} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, cursor: "pointer" }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{code.icon} {code.game}</h3>
              <div style={{ fontSize: 12, color: "var(--neon-green)", fontWeight: 800, marginBottom: 4 }}>✅ {code.count} Active Codes</div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>Updated {code.updated}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }