import { supabase } from "../lib/supabase";

export default async function Codes() {
  const [{ data: games }, { data: codes }] = await Promise.all([
    supabase.from("code_games").select("slug, game, icon, updated_at").order("game"),
    supabase.from("codes").select("slug, active"),
  ]);

  const gameList = (games ?? []).map((g) => {
    const activeCount = (codes ?? []).filter((c) => c.slug === g.slug && c.active).length;
    return {
      slug: g.slug,
      game: g.game,
      icon: g.icon,
      activeCount,
      updatedAt: new Date(g.updated_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  });

  return (
    <div id="codes" style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>{"🎁 Latest Roblox Codes"}</h2>
        <a href="/codes" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>{"View All Codes →"}</a>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {gameList.map((game) => (
          <a key={game.slug} href={`/codes/${game.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, cursor: "pointer" }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, color: "var(--text)" }}>
                {game.icon + " " + game.game + " Codes"}
              </h3>
              <div style={{ fontSize: 12, color: "var(--neon-green)", fontWeight: 800, marginBottom: 4 }}>
                {"✅ " + game.activeCount + " Active Codes"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>
                {"Updated " + game.updatedAt}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}