"use client";
import { useState } from "react";

export default function EmailSignup() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section style={{ maxWidth: 1200, margin: "60px auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(circle, rgba(0,245,160,0.08), transparent 60%)", pointerEvents: "none" }} />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 10, position: "relative" }}>🔔 Get Daily Codes & Quizzes</h2>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 24, position: "relative" }}>Join 12,000+ Roblox fans. New codes, quizzes, and challenges delivered daily.</p>
        <div style={{ display: "flex", gap: 12, maxWidth: 440, margin: "0 auto", position: "relative" }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{ flex: 1, padding: "14px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 15, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none" }}
          />
          <button
            onClick={() => setSubmitted(true)}
            style={{ padding: "14px 28px", background: submitted ? "var(--neon-green)" : "var(--gradient-main)", color: "var(--bg)", border: "none", borderRadius: 100, fontWeight: 900, fontSize: 15, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}
          >
            {submitted ? "✅ Subscribed!" : "Subscribe"}
          </button>
        </div>
      </div>
    </section>
  );
}