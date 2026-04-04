// app/components/RobuxCTA.tsx
const AFFILIATE_URL = "https://www.amazon.com/s?k=roblox+gift+card&tag=bloxquiz-20";

export default function RobuxCTA({ variant = "default" }: { variant?: "default" | "compact" | "card" }) {
  if (variant === "compact") {
    return (
      <a href={AFFILIATE_URL} target="_blank" rel="nofollow sponsored noopener"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,227,71,0.1)", border: "1px solid rgba(255,227,71,0.25)", borderRadius: 100, padding: "8px 18px", textDecoration: "none", fontSize: 13, fontWeight: 800, color: "var(--neon-yellow)" }}>
        🎮 Get Robux Gift Cards from $10 →
      </a>
    );
  }

  if (variant === "card") {
    return (
      <a href={AFFILIATE_URL} target="_blank" rel="nofollow sponsored noopener"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "linear-gradient(135deg, rgba(255,227,71,0.08), rgba(184,76,255,0.06))", border: "1px solid rgba(255,227,71,0.2)", borderRadius: "var(--radius)", padding: "16px 20px", textDecoration: "none", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "var(--neon-yellow)", marginBottom: 2 }}>🎮 Want more Robux?</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Get Roblox Gift Cards on Amazon — from $10</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 900, color: "var(--neon-yellow)", whiteSpace: "nowrap" }}>Shop Now →</span>
      </a>
    );
  }

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255,227,71,0.08), rgba(184,76,255,0.06))", border: "1px solid rgba(255,227,71,0.2)", borderRadius: "var(--radius)", padding: "20px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "var(--neon-yellow)", marginBottom: 6 }}>🎮 Want more Robux?</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, marginBottom: 14 }}>Treat yourself to a Roblox Gift Card on Amazon</div>
      <a href={AFFILIATE_URL} target="_blank" rel="nofollow sponsored noopener"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #FFE347, #FFB347)", color: "#0B0E17", fontWeight: 900, fontSize: 14, padding: "10px 24px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "#0B0E17" }}>
        🛒 Get Roblox Gift Cards from $10
      </a>
      <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 8 }}>Via Amazon · Affiliate link</div>
    </div>
  );
}