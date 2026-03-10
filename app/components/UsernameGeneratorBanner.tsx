export default function UsernameGeneratorBanner() {
    return (
      <section style={{ maxWidth: 1200, margin: "0 auto 48px", padding: "0 24px" }}>
        <a href="/roblox-username-ideas" style={{ textDecoration: "none", display: "block" }}>
          <div style={{
            position: "relative",
            borderRadius: "var(--radius)",
            border: "1px solid rgba(184,76,255,0.3)",
            background: "linear-gradient(135deg, rgba(184,76,255,0.08), rgba(0,245,160,0.06))",
            padding: "28px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            overflow: "hidden",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}>
            {/* Glow blob */}
            <div style={{ position: "absolute", top: -40, right: 80, width: 200, height: 200, background: "radial-gradient(circle, rgba(184,76,255,0.15), transparent 70%)", pointerEvents: "none" }} />
  
            <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 48, lineHeight: 1 }}>✨</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "#B84CFF", marginBottom: 6 }}>Free Tool</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text)", margin: 0, marginBottom: 6 }}>
                  Roblox Username Generator
                </h2>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-dim)", margin: 0, lineHeight: 1.5 }}>
                  1,100+ unique username ideas across 10 categories — Gaming, Aesthetic, Funny & more
                </p>
              </div>
            </div>
  
            <div style={{
              flexShrink: 0,
              padding: "12px 28px",
              borderRadius: 100,
              background: "linear-gradient(135deg, #B84CFF, #00F5A0)",
              color: "#0B0E17",
              fontFamily: "var(--font-body)",
              fontWeight: 900,
              fontSize: 14,
              whiteSpace: "nowrap",
              position: "relative",
              zIndex: 1,
            }}>
              Find Your Username →
            </div>
          </div>
        </a>
      </section>
    );
  }