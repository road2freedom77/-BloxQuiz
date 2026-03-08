"use client";
import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email!");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setSubmitted(true);
    } else {
      setError(data.error || "Something went wrong. Try again!");
    }
  }

  return (
    <section style={{ maxWidth: 1200, margin: "60px auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(circle, rgba(0,245,160,0.08), transparent 60%)", pointerEvents: "none" }} />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 10, position: "relative" }}>
          {"🔔 Get Daily Codes & Quizzes"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 24, position: "relative" }}>
          Join Roblox fans. New codes, quizzes, and challenges delivered daily.
        </p>

        {submitted ? (
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--neon-green)" }}>
            {"✅ You're subscribed! Check your inbox soon."}
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 12, maxWidth: 440, margin: "0 auto", position: "relative" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                style={{ flex: 1, padding: "14px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 15, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none" }}
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                style={{ padding: "14px 28px", background: "var(--gradient-main)", color: "var(--bg)", border: "none", borderRadius: 100, fontWeight: 900, fontSize: 15, cursor: loading ? "default" : "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1, WebkitTextFillColor: "var(--bg)" }}
              >
                {loading ? "Saving..." : "Subscribe"}
              </button>
            </div>
            {error && (
              <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--neon-pink)" }}>
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}