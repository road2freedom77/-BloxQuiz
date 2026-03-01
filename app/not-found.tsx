"use client";
import { useState, useEffect } from "react";

const messages = [
  {
    emoji: "💀",
    title: "You Got Banned From This Island",
    desc: "Looks like this page doesn't exist. Even the Blox Fruit Dealer doesn't know where it went. Maybe it got reset like a Tower of Hell run?"
  },
  {
    emoji: "🍎",
    title: "This Fruit Doesn't Exist",
    desc: "You searched everywhere — First Sea, Second Sea, Third Sea — and this page is nowhere to be found. Even the Blox Fruit Dealer is confused."
  },
  {
    emoji: "😵",
    title: "Eliminated in Round 1",
    desc: "You fell off the map looking for this page. Even the best Tower of Hell players couldn't find it. Time to respawn!"
  },
  {
    emoji: "🔪",
    title: "The Murderer Got This Page",
    desc: "This page has been eliminated. The Sheriff had no clues, the Innocent had no idea. It's gone. Vanished. Like your Godly knife trade."
  },
  {
    emoji: "🌱",
    title: "Nothing Grew Here",
    desc: "You planted this URL but nothing grew. Not even a Common Carrot. Maybe try watering a different page?"
  },
  {
    emoji: "🐾",
    title: "This Pet Doesn't Exist",
    desc: "You checked every egg in Adopt Me and still couldn't hatch this page. It's not Legendary, it's not even Common — it just doesn't exist."
  },
];

export default function NotFound() {
  const [msg, setMsg] = useState(messages[0]);

  useEffect(() => {
    setMsg(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 24px",
      position: "relative",
      zIndex: 1
    }}>
      <div style={{ fontSize: 80, marginBottom: 8 }}>{msg.emoji}</div>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(80px, 15vw, 140px)",
        background: "var(--gradient-fire)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1,
        marginBottom: 8
      }}>404</div>

      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(22px, 4vw, 36px)",
        marginBottom: 12
      }}>{msg.title}</h1>

      <p style={{
        color: "var(--text-muted)",
        fontSize: 16,
        fontWeight: 600,
        maxWidth: 420,
        margin: "0 auto 32px",
        lineHeight: 1.6
      }}>{msg.desc}</p>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px 28px",
        marginBottom: 32,
        maxWidth: 380
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Try One Of These Instead</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { emoji: "⚡", label: "Random Quiz", href: "/quiz/random" },
            { emoji: "🎮", label: "Browse All Quizzes", href: "/browse" },
            { emoji: "🏆", label: "Leaderboard", href: "/#leaderboard" },
            { emoji: "🏠", label: "Go Home", href: "/" },
          ].map(({ emoji, label, href }) => (
            <a key={label} href={href} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              textDecoration: "none",
              color: "var(--text)",
              fontWeight: 700,
              fontSize: 14,
            }}>
              <span style={{ fontSize: 20 }}>{emoji}</span>
              {label}
            </a>
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
        fontSize: 12, color: "var(--text-dim)", fontWeight: 700
      }}>
        {["💀 Respawning...", "🍎 Fruit not found", "🗡️ Quest failed", "🔥 0 Day Streak"].map(tag => (
          <span key={tag} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: "4px 12px",
            borderRadius: 100
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}