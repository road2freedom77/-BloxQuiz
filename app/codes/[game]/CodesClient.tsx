"use client";
import { useState } from "react";

export default function CodesClient({ data, game }: { data: any, game: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const activeCodes = data.codes.filter((c: any) => c.active);
  const expiredCodes = data.codes.filter((c: any) => !c.active);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <a href="/codes" style={{ fontSize: 13, fontWeight: 800, color: "var(--text-muted)", textDecoration: "none" }}>
        {"← All Codes"}
      </a>

      <div style={{ marginTop: 24, marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{data.icon}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", marginBottom: 8 }}>
          {data.game + " Codes 2026"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 15 }}>
          {activeCodes.length + " active codes — Updated " + data.updatedAt}
        </p>
      </div>

      <div style={{ background: "rgba(0,245,160,0.05)", border: "1px solid rgba(0,245,160,0.2)", borderRadius: "var(--radius)", padding: 20, marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--neon-green)", marginBottom: 8 }}>
          {"✅ How to Redeem Codes"}
        </div>
        <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>
          {"Open " + data.game + " → click the Twitter/Codes button in the menu → enter the code exactly as shown → hit Redeem!"}
        </div>
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>
        {"🟢 Active Codes"}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
        {activeCodes.map((c: any) => (
          <div key={c.code} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--neon-green)", letterSpacing: 1 }}>{c.code}</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{c.reward}</span>
            </div>
            <button
              onClick={() => copyCode(c.code)}
              style={{ background: copied === c.code ? "var(--neon-green)" : "var(--gradient-main)", color: "var(--bg)", border: "none", borderRadius: 100, padding: "8px 18px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)", minWidth: 70 }}
            >
              {copied === c.code ? "✅ Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      {expiredCodes.length > 0 && (
        <>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16, color: "var(--text-muted)" }}>
            {"🔴 Expired Codes"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {expiredCodes.map((c: any) => (
              <div key={c.code} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, textDecoration: "line-through" }}>{c.code}</span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{c.reward}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--neon-pink)" }}>Expired</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 48, padding: 24, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>
          {"🎮 Think You Know " + data.game + "?"}
        </div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
          Test your knowledge with our free quizzes!
        </p>
        <a href={"/games/" + game} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
          {"View " + data.game + " Quizzes"}
        </a>
      </div>
    </div>
  );
}