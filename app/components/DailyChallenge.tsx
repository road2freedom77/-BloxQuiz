export default function DailyChallenge() {
    return (
      <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: "-60%", right: "-20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(255,60,172,0.08), transparent 70%)", pointerEvents: "none" }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--neon-pink)", marginBottom: 12 }}>⚡ Daily Challenge — Feb 28, 2026</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 10 }}>Today: Blox Fruits Update 24</h2>
            <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 24 }}>10 questions about the latest Blox Fruits update. New fruits, locations, and bosses. Can you get a perfect score?</p>
            <a href="/quiz" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--gradient-main)",
              color: "var(--bg)", fontWeight: 900, fontSize: 16,
              padding: "16px 36px", borderRadius: 100,
              textDecoration: "none", WebkitTextFillColor: "var(--bg)",
              boxShadow: "0 4px 20px rgba(0,245,160,0.25)"
            }}>🎯 Take Today's Challenge</a>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[["2,847","Played Today"],["7.2","Avg Score"],["3%","Perfect Score"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center", padding: "16px 24px", background: "var(--surface)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--neon-yellow)" }}>{num}</div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }