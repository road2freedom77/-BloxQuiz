import { supabaseAdmin } from "@/app/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Expired Roblox Codes (2026) — Recently Expired Code List | BloxQuiz",
  description: "Roblox codes that recently expired across all tracked games. Check which codes are no longer active for Blox Fruits, Adopt Me, Doors, and more.",
  alternates: { canonical: "https://www.bloxquiz.gg/codes/expired" },
  openGraph: {
    title: "Expired Roblox Codes (2026) | BloxQuiz",
    description: "Recently expired Roblox codes across all tracked games. Updated daily.",
    url: "https://www.bloxquiz.gg/codes/expired",
    siteName: "BloxQuiz",
    type: "website",
  },
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

export default async function ExpiredCodesPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: rawCodes } = await supabaseAdmin
    .from("codes")
    .select("code, reward, active, updated_at, slug")
    .eq("active", false)
    .gte("updated_at", thirtyDaysAgo)
    .order("updated_at", { ascending: false });

  const { data: gameData } = await supabaseAdmin
    .from("code_games")
    .select("slug, game, icon");

  const gameMap = Object.fromEntries((gameData ?? []).map(g => [g.slug, g]));

  // Group by slug
  const grouped: Record<string, { game: string; slug: string; icon: string; lastExpired: string; codes: { code: string; reward: string; updated_at: string }[] }> = {};
  for (const c of rawCodes ?? []) {
    const g = gameMap[c.slug];
    if (!g) continue;
    if (!grouped[c.slug]) {
      grouped[c.slug] = { game: g.game, slug: c.slug, icon: g.icon, lastExpired: c.updated_at, codes: [] };
    }
    grouped[c.slug].codes.push({ code: c.code, reward: c.reward, updated_at: c.updated_at });
  }

  // Sort groups by most recently expired
  const groups = Object.values(grouped).sort((a, b) =>
    new Date(b.lastExpired).getTime() - new Date(a.lastExpired).getTime()
  );

  const totalExpired = (rawCodes ?? []).length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
        <Link href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</Link>
        <span>{"›"}</span>
        <Link href="/codes" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Codes</Link>
        <span>{"›"}</span>
        <span style={{ color: "var(--text-muted)" }}>Expired</span>
      </div>

      {/* Hero */}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 12 }}>
        {"💀 Recently Expired Roblox Codes"}
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 700, marginBottom: 20 }}>
        Roblox codes that expired in the last 30 days. These codes are no longer active — head to each game's codes page to find what's still working.
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,100,100,0.9)" }}>{"💀 " + totalExpired + " Expired Codes"}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--neon-blue)" }}>{"🎮 " + groups.length + " Games"}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-muted)" }}>{"📅 Last 30 Days"}</span>
      </div>

      {/* Freshness nav */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        <Link href="/codes/new" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 100, textDecoration: "none" }}>{"🆕 New Codes"}</Link>
        <Link href="/codes/recently-updated" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 100, textDecoration: "none" }}>{"🔄 Recently Updated"}</Link>
        <span style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 100, WebkitTextFillColor: "var(--bg)" }}>{"💀 Expired"}</span>
        <Link href="/codes" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 100, textDecoration: "none" }}>{"🎁 All Codes"}</Link>
      </div>

      {/* Notice */}
      <div style={{ background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderLeft: "3px solid rgba(255,100,100,0.6)", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
          {"⚠️ These codes are expired and can no longer be redeemed. Visit each game's codes page to find currently active codes."}
        </div>
      </div>

      {/* Grouped codes */}
      {groups.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontWeight: 700 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div>No recently expired codes — everything is still active!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {groups.map(({ game, slug, icon, lastExpired, codes }) => (
            <div key={slug} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", opacity: 0.85 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {icon && <span style={{ fontSize: 24 }}>{icon}</span>}
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{game}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,100,100,0.7)", fontWeight: 700 }}>{"Expired " + timeAgo(lastExpired) + " · " + codes.length + " code" + (codes.length !== 1 ? "s" : "")}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={"/codes/" + slug} style={{ fontSize: 12, fontWeight: 700, color: "var(--neon-green)", textDecoration: "none", padding: "6px 14px", background: "rgba(0,245,160,0.08)", borderRadius: 100, border: "1px solid rgba(0,245,160,0.2)" }}>{"✅ Active Codes →"}</Link>
                  <Link href={"/stats/" + slug} style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "6px 14px", background: "var(--surface)", borderRadius: 100, border: "1px solid var(--border)" }}>{"📊 Stats →"}</Link>
                </div>
              </div>
              <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                {codes.map(c => (
                  <div key={c.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,100,100,0.7)", background: "rgba(255,100,100,0.08)", padding: "2px 8px", borderRadius: 100, border: "1px solid rgba(255,100,100,0.2)" }}>{"💀 EXPIRED"}</span>
                      <code style={{ fontSize: 14, fontWeight: 800, color: "var(--text-dim)", background: "var(--surface)", padding: "4px 12px", borderRadius: 8, letterSpacing: "0.05em", textDecoration: "line-through" }}>{c.code}</code>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600 }}>{c.reward}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cross-links */}
      <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/codes" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"🎁 All Active Codes"}</Link>
        <Link href="/codes/new" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"🆕 New Codes"}</Link>
        <Link href="/codes/recently-updated" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"🔄 Recently Updated"}</Link>
        <Link href="/browse" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"🎮 Quizzes"}</Link>
      </div>

    </div>
  );
}