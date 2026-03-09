"use client";
import { useState } from "react";

const recentActivity = [
    { action: "added", game: "Blox Fruits", code: "TRIPLEFLASH", reward: "2x XP Boost", date: "March 8, 2026" },
    { action: "added", game: "Anime Defenders", code: "DEFENDERS2026", reward: "Free Gems", date: "March 8, 2026" },
    { action: "added", game: "Murder Mystery 2", code: "CORRUPT", reward: "Free Knife", date: "March 8, 2026" },
    { action: "expired", game: "Blox Fruits", code: "STRAWHATMAINE", reward: "2x XP Boost", date: "March 8, 2026" },
    { action: "added", game: "Doors", code: "SURVIVE", reward: "Free Knobs", date: "March 8, 2026" },
    { action: "added", game: "Bee Swarm Simulator", code: "MarchIsMerry", reward: "Marshmallow Bee + Boosts", date: "March 9, 2026" },
    { action: "added", game: "Dress to Impress", code: "LNY", reward: "Lunar New Year items", date: "March 9, 2026" },
  ];

export default function CodesHubClient({ games }: { games: any[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      {/* Recent activity module */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "22px 24px", marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>{"🆕 Recently Updated"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recentActivity.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 900, padding: "2px 10px", borderRadius: 100, textTransform: "uppercase", background: item.action === "added" ? "rgba(0,245,160,0.12)" : "rgba(255,60,172,0.1)", color: item.action === "added" ? "var(--neon-green)" : "var(--neon-pink)" }}>
                  {item.action === "added" ? "+ Added" : "✗ Expired"}
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", letterSpacing: 0.5 }}>{item.code}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{"— " + item.game}</span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{item.reward}</span>
              </div>
              <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Games grid */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 20 }}>{"🔥 Latest Roblox Codes by Game"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, marginBottom: 48 }}>
        {games.map(game => {
          const activeCodes = game.codes.filter((c: any) => c.active);
          return (
            <div key={game.slug} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, boxSizing: "border-box" }}>
              <a href={`/codes/${game.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 32 }}>{game.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 2, color: "var(--text)" }}>{game.game + " Codes"}</h3>
                    <div style={{ fontSize: 12, color: activeCodes.length > 0 ? "var(--neon-green)" : "var(--text-dim)", fontWeight: 800 }}>
                      {activeCodes.length > 0 ? "✅ " + activeCodes.length + " Active Codes" : "⚠️ No Active Codes"}
                    </div>
                  </div>
                </div>
              </a>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {activeCodes.slice(0, 3).map((c: any) => (
                  <div key={c.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", borderRadius: 8, padding: "8px 12px", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--neon-green)", letterSpacing: 0.5, flexShrink: 0 }}>{c.code}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.reward}</span>
                    </div>
                    <button onClick={() => copyCode(c.code)}
                      style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: copied === c.code ? "rgba(0,245,160,0.15)" : "rgba(0,217,255,0.1)", color: copied === c.code ? "var(--neon-green)" : "var(--neon-blue)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", flexShrink: 0, WebkitTextFillColor: copied === c.code ? "var(--neon-green)" : "var(--neon-blue)" }}>
                      {copied === c.code ? "✅" : "Copy"}
                    </button>
                  </div>
                ))}
                {activeCodes.length > 3 && (
                  <a href={`/codes/${game.slug}`} style={{ fontSize: 12, color: "var(--neon-blue)", fontWeight: 700, textAlign: "center", paddingTop: 4, textDecoration: "none" }}>
                    {"+" + (activeCodes.length - 3) + " more codes →"}
                  </a>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{"Updated " + game.updatedAt}</span>
                <a href={`/codes/${game.slug}`} style={{ fontSize: 11, fontWeight: 800, color: "var(--neon-blue)", textDecoration: "none" }}>{"View All →"}</a>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}