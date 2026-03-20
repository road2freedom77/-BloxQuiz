"use client";
import { useEffect, useState } from "react";

export default function DailyChallenge({ initialDaily }: { initialDaily: any }) {
  const [daily, setDaily] = useState<any>(initialDaily);

  useEffect(() => {
    fetch("/api/daily")
      .then(r => r.json())
      .then(data => setDaily(data));
  }, []);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  function goToChallenge() {
    if (daily?.slug) window.location.href = "/quiz/" + daily.slug;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: 40,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-60%", right: "-20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(255,60,172,0.08), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--neon-pink)", marginBottom: 12 }}>
          ⚡ Daily Challenge — {formattedDate}
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 10 }}>
          {daily ? "Today: " + daily.title : "Loading today's challenge..."}
        </h2>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 24 }}>
          {daily
            ? `A ${daily.difficulty} quiz about ${daily.game}. Can you get a perfect score? New challenge drops every day at midnight!`
            : "Get ready to test your Roblox knowledge..."}
        </p>
        <button onClick={goToChallenge} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 16,
          padding: "16px 36px", borderRadius: 100, border: "none",
          cursor: "pointer", fontFamily: "var(--font-body)",
          WebkitTextFillColor: "var(--bg)", boxShadow: "0 4px 20px rgba(0,245,160,0.25)"
        }}>
          🎯 Take Today's Challenge
        </button>
      </div>
    </div>
  );
}
