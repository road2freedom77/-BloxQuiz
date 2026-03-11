"use client";
import { useState } from "react";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleUnsubscribe() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setError("");

    const res = await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setError(data.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 480, width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 48, textAlign: "center" }}>

        {status === "success" ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>You're unsubscribed</h1>
            <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 24 }}>
              You won't receive any more quiz emails from BloxQuiz.
            </p>
            <a href="/" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 100, background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
              Back to BloxQuiz
            </a>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔕</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>Unsubscribe</h1>
            <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 32 }}>
              Enter your email address and we'll remove you from our quiz notification list.
            </p>

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleUnsubscribe()}
              style={{ width: "100%", padding: "14px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 15, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
            />

            {error && (
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--neon-pink)", marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleUnsubscribe}
              disabled={status === "loading"}
              style={{ width: "100%", padding: "14px 28px", background: "var(--neon-pink)", color: "var(--bg)", border: "none", borderRadius: 100, fontWeight: 900, fontSize: 15, cursor: status === "loading" ? "default" : "pointer", fontFamily: "var(--font-body)", opacity: status === "loading" ? 0.7 : 1, WebkitTextFillColor: "var(--bg)" }}
            >
              {status === "loading" ? "Unsubscribing..." : "Unsubscribe"}
            </button>

            <div style={{ marginTop: 24 }}>
              <a href="/" style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                ← Back to BloxQuiz
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}