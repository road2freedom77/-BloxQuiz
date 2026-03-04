"use client";
import { useState } from "react";

const gameSlugMap: Record<string, string> = {
  "blox-fruits": "blox-fruits",
  "adopt-me": "adopt-me",
  "murder-mystery-2": "murder-mystery-2",
  "grow-a-garden": "grow-a-garden",
  "brookhaven-rp": "brookhaven-rp",
  "tower-of-hell": "tower-of-hell",
  "royale-high": "royale-high",
  "doors": "doors",
  "arsenal": "arsenal",
  "anime-fighting-simulator": "anime-fighting-simulator",
  "berry-avenue": "berry-avenue",
  "livetopia": "livetopia",
  "natural-disaster-survival": "natural-disaster-survival",
  "anime-defenders": "anime-defenders",
  "funky-friday": "funky-friday",
  "kick-off": "kick-off",
};

export default function CodesClient({ data, game, description, activeCodes, expiredCodes }: {
  data: any,
  game: string,
  description: string,
  activeCodes: any[],
  expiredCodes: any[],
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  const quizSlug = gameSlugMap[game] || game;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumb */}
      <nav style={{ marginBottom: 20 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)", flexWrap: "wrap" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li>›</li>
          <li><a href="/codes" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Roblox Codes</a></li>
          <li>›</li>
          <li style={{ color: "var(--text)" }}>{data.game + " Codes"}</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{data.icon}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", marginBottom: 12 }}>
          {data.game + " Codes 2026 — All Active & Working"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 15, lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>
          {description}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(0,245,160,0.12)", color: "var(--neon-green)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"✅ " + activeCodes.length + " Active Codes"}</span>
          <span style={{ background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"❌ " + expiredCodes.length + " Expired"}</span>
          <span style={{ background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"🔄 Updated " + data.updatedAt}</span>
        </div>
      </div>

      {/* How to redeem — game specific */}
      <div style={{ background: "rgba(0,245,160,0.05)", border: "1px solid rgba(0,245,160,0.2)", borderRadius: "var(--radius)", padding: "22px 24px", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--neon-green)", marginBottom: 12 }}>
          {"How To Redeem " + data.game + " Codes"}
        </h2>
        {data.redeemSteps ? (
          <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {data.redeemSteps.map((step: string, i: number) => (
              <li key={i} style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
        ) : (
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, margin: 0 }}>
            {"Open " + data.game + " → click the Codes button in the menu → enter the code exactly as shown → hit Redeem!"}
          </p>
        )}
        <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginTop: 12, fontStyle: "italic" }}>
          ⚠️ Codes are case sensitive — type them exactly as shown above.
        </p>
      </div>

      {/* Active codes */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>
        {"🟢 Active " + data.game + " Codes"}
      </h2>
      {activeCodes.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 24, textAlign: "center", color: "var(--text-muted)", fontWeight: 700, marginBottom: 40 }}>
          No active codes right now — check back soon! New codes are added regularly.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
          {activeCodes.map((c: any) => (
            <div key={c.code} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--neon-green)", letterSpacing: 1 }}>{c.code}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{"→ " + c.reward}</span>
              </div>
              <button onClick={() => copyCode(c.code)}
                style={{ background: copied === c.code ? "rgba(0,245,160,0.2)" : "var(--gradient-main)", color: copied === c.code ? "var(--neon-green)" : "var(--bg)", border: copied === c.code ? "1px solid var(--neon-green)" : "none", borderRadius: 100, padding: "8px 20px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: copied === c.code ? "var(--neon-green)" : "var(--bg)", minWidth: 90, transition: "all 0.2s" }}>
                {copied === c.code ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Expiring soon notice */}
      <div style={{ background: "rgba(255,227,71,0.08)", border: "1px solid rgba(255,227,71,0.2)", borderRadius: "var(--radius-sm)", padding: "14px 20px", marginBottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--neon-yellow)", marginBottom: 2 }}>Codes Expire Without Warning</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>Bookmark this page and check back daily. We update codes as soon as new ones are released.</div>
        </div>
      </div>

      {/* Expired codes */}
      {expiredCodes.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16, color: "var(--text-muted)" }}>
            {"🔴 Expired " + data.game + " Codes"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 12 }}>These codes no longer work but are kept for reference.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {expiredCodes.map((c: any) => (
              <div key={c.code} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, textDecoration: "line-through", color: "var(--text-dim)" }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{c.reward}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--neon-pink)" }}>Expired</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"Frequently Asked Questions"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { q: `How many active ${data.game} codes are there?`, a: `There are currently ${activeCodes.length} active ${data.game} codes listed on this page. We update regularly as new codes are released.` },
            { q: `Why isn't my ${data.game} code working?`, a: `Codes are case sensitive — make sure you type them exactly as shown. The code may also have expired or already been redeemed on your account.` },
            { q: `How do I get new ${data.game} codes?`, a: `New ${data.game} codes are announced on the game's official Twitter/X account, Discord server, and YouTube channel. Bookmark this page for daily updates.` },
          ].map((faq, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-link to quiz hub */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{data.icon}</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>
          {"Think You Know " + data.game + "?"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
          {"Put your " + data.game + " knowledge to the test with our free trivia quizzes!"}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={"/games/" + quizSlug}
            style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
            {"🎮 " + data.game + " Quizzes"}
          </a>
          <a href="/codes"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>
            {"🎁 All Roblox Codes"}
          </a>
        </div>
      </div>

    </div>
  );
}