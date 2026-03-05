"use client";

const TICKER_ITEMS = [
  "🏆 Season 1 Active — Win Robux Gift Cards",
  "🔥 Top 3 Players Earn Real Prizes",
  "🎮 Play Quizzes → Climb the Leaderboard",
  "💰 1st Place wins $20 Roblox Gift Card",
  "⚡ Free to Play — No Download Required",
  "🎯 Hard Quizzes = 2x Leaderboard Points",
  "🔥 Daily Streaks = Bonus Points",
  "👑 Top 3 this month win gift cards",
  "🎁 Free Roblox Codes Updated Daily",
  "⚔️ Blox Fruits · Adopt Me · Doors · MM2 · and More",
];

const TICKER_STRING = TICKER_ITEMS.join("   •   ");

export default function TickerBanner() {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 101,
      background: "linear-gradient(90deg, #0d0118, #1a0030, #0d0118)",
      borderBottom: "1px solid rgba(184,76,255,0.3)",
      overflow: "hidden",
      height: 34,
      display: "flex",
      alignItems: "center",
    }}>
      <div aria-hidden="true" style={{
        display: "flex",
        whiteSpace: "nowrap",
        animation: "ticker 40s linear infinite",
      }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#B84CFF", paddingRight: 80, letterSpacing: 0.3 }}>
          {TICKER_STRING}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{TICKER_STRING}
        </span>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}