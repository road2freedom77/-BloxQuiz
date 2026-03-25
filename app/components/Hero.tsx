import { supabase } from "../lib/supabase";

export default async function Hero() {
  let quizCount = 350;
  let gameCount = 20;
  let codeCount = 97;

  try {
    const [
      { count: qCount },
      { data: games },
      { count: cCount },
    ] = await Promise.all([
      supabase.from("quizzes").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("quizzes").select("game"),
      supabase.from("codes").select("*", { count: "exact", head: true }).eq("active", true),
    ]);

    const distinctGames = new Set((games ?? []).map(r => r.game)).size;

    quizCount = qCount ?? 350;
    gameCount = distinctGames || gameCount;
    codeCount = cCount ?? codeCount;
  } catch {
    // fallback to hardcoded values above
  }

  const proofBlocks = [
    { value: `${quizCount}+`, label: `Quizzes Across ${gameCount} Games` },
    { value: `${codeCount}`,  label: "Active Codes Updated Daily" },
    { value: "LIVE",          label: "Player Counts from Roblox" },
  ];

  return (
    <section style={{
      maxWidth: 1200, margin: "0 auto",
      padding: "72px 24px 40px",
      textAlign: "center",
      position: "relative", zIndex: 1
    }}>
      {/* Badges */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(0,245,160,0.12)", color: "var(--neon-green)" }}>● {quizCount}+ Quizzes</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(255,60,172,0.12)", color: "var(--neon-pink)" }}>● Daily Challenges</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(255,227,71,0.12)", color: "var(--neon-yellow)" }}>● Free Codes</span>
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(40px, 6vw, 74px)",
        lineHeight: 1.05, letterSpacing: 1,
        marginBottom: 18
      }}>
        How Well Do You<br />
        <span style={{ background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Really Know</span>{" "}
        <span style={{ background: "var(--gradient-fire)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Roblox?</span>
      </h1>

      {/* Subheading */}
      <p style={{ fontSize: 18, color: "var(--text-muted)", maxWidth: 540, margin: "0 auto 36px", fontWeight: 600 }}>
        Test your knowledge on Blox Fruits, Brookhaven, Adopt Me & more. Play quizzes, earn XP, and see live player counts.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
        <a href="/quiz/random" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--gradient-main)",
          color: "var(--bg)", fontWeight: 900, fontSize: 16,
          padding: "16px 36px", borderRadius: 100,
          textDecoration: "none", WebkitTextFillColor: "var(--bg)",
          boxShadow: "0 4px 20px rgba(0,245,160,0.25)"
        }}>⚡ Start Random Quiz</a>
        <a href="/browse" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--surface)", color: "var(--text)",
          fontWeight: 800, fontSize: 16,
          padding: "16px 36px", borderRadius: 100,
          textDecoration: "none", border: "1px solid var(--border)"
        }}>🎮 Browse All Quizzes</a>
      </div>

      {/* Proof Blocks */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, rowGap: 8, flexWrap: "wrap" }}>
        {proofBlocks.map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center", minWidth: 100 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 5vw, 32px)",
              background: "var(--gradient-main)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1.1,
            }}>{value}</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}