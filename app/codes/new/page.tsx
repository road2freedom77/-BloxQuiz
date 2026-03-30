import { supabaseAdmin } from "@/app/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Roblox Codes Today (2026) — Latest Codes Just Added | BloxQuiz",
  description: "The latest new Roblox codes added to BloxQuiz. Fresh codes for Blox Fruits, Adopt Me, Doors, and more — updated daily. Redeem before they expire!",
  alternates: { canonical: "https://www.bloxquiz.gg/codes/new" },
  openGraph: {
    title: "New Roblox Codes Today (2026) | BloxQuiz",
    description: "Latest new Roblox codes just added. Redeem free rewards before they expire!",
    url: "https://www.bloxquiz.gg/codes/new",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export default async function NewCodesPage() {
  const { data: rawCodes } = await supabaseAdmin
    .from("codes")
    .select("code, reward, active, updated_at, slug")
    .eq("is_new", true)
    .eq("active", true)
    .order("updated_at", { ascending: false });

  const { data: gameData } = await supabaseAdmin
    .from("code_games")
    .select("slug, game, icon");

  const gameMap = Object.fromEntries((gameData ?? []).map(g => [g.slug, g]));

  // Group by slug
  const grouped: Record<string, { game: string; slug: string; icon: string; codes: { code: string; reward: string; updated_at: string }[] }> = {};
  for (const c of rawCodes ?? []) {
    const g = gameMap[c.slug];
    if (!g) continue;
    if (!grouped[c.slug]) {
      grouped[c.slug] = { game: g.game, slug: c.slug, icon: g.icon, codes: [] };
    }
    grouped[c.slug].codes.push({ code: c.code, reward: c.reward, updated_at: c.updated_at });
  }

  const groups = Object.values(grouped);
  const totalNew = (rawCodes ?? []).length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
        <Link href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</Link>
        <span>{"›"}</span>
        <Link href="/codes" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Codes</Link>
        <span>{"›"}</span>
        <span style={{ color: "var(--text-muted)" }}>New Codes</span>
      </div>

      {/* Hero */}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 12 }}>
        {"🆕 New Roblox Codes"}
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 700, marginBottom: 20 }}>
        The latest codes added to BloxQuiz across all tracked Roblox games. These codes are freshly verified — redeem them before they expire!
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--neon-green)" }}>{"✅ " + totalNew + " New Codes"}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--neon-blue)" }}>{"🎮 " + groups.length + " Games"}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-muted)" }}>{"🔄 Updated Daily"}</span>
      </div>

      {/* Freshness nav */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        <span style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 100, WebkitTextFillColor: "var(--bg)" }}>{"🆕 New Codes"}</span>
        <Link href="/codes/recently-updated" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 100, textDecoration: "none" }}>{"🔄 Recently Updated"}</Link>
        <Link href="/codes/expired" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 100, textDecoration: "none" }}>{"💀 Expired"}</Link>
        <Link href="/codes" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 100, textDecoration: "none" }}>{"🎁 All Codes"}</Link>
      </div>

      {/* Grouped codes */}
      {groups.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontWeight: 700 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div>No new codes right now — check back soon!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {groups.map(({ game, slug, icon, codes }) => (
            <div key={slug} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {icon && <span style={{ fontSize: 24 }}>{icon}</span>}
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{game}</div>
                    <div style={{ fontSize: 12, color: "var(--neon-green)", fontWeight: 700 }}>{codes.length + " new code" + (codes.length !== 1 ? "s" : "")}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={"/codes/" + slug} style={{ fontSize: 12, fontWeight: 700, color: "var(--neon-blue)", textDecoration: "none", padding: "6px 14px", background: "rgba(0,217,255,0.08)", borderRadius: 100, border: "1px solid rgba(0,217,255,0.2)" }}>{"🎁 All Codes →"}</Link>
                  <Link href={"/stats/" + slug} style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "6px 14px", background: "var(--surface)", borderRadius: 100, border: "1px solid var(--border)" }}>{"📊 Stats →"}</Link>
                </div>
              </div>
              <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                {codes.map(c => (
                  <div key={c.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "var(--neon-green)", background: "rgba(0,245,160,0.1)", padding: "2px 8px", borderRadius: 100, border: "1px solid rgba(0,245,160,0.2)" }}>{"🆕 NEW"}</span>
                      <code style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", background: "var(--surface)", padding: "4px 12px", borderRadius: 8, letterSpacing: "0.05em" }}>{c.code}</code>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{c.reward}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cross-links */}
      <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/codes" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"🎁 All Codes"}</Link>
        <Link href="/codes/recently-updated" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"🔄 Recently Updated"}</Link>
        <Link href="/codes/expired" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"💀 Expired Codes"}</Link>
        <Link href="/browse" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"🎮 Quizzes"}</Link>
      </div>

    </div>
  );
}