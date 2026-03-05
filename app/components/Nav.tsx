"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO", // Marcin
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT", // Aiden
];

const TICKER_ITEMS = [
  "🏆 Season 1 Coming Soon — Win Robux Gift Cards",
  "🔥 Top Players Earn Real Prizes",
  "🎮 Play Quizzes → Climb the Leaderboard",
  "💰 Robux Gift Cards Up for Grabs",
  "⚡ Free to Play — No Download Required",
  "🎯 Hard Quizzes = 2x Leaderboard Points",
  "🔥 Daily Streaks = Bonus Points",
  "👑 Season 1 Launches Soon — Start Grinding Now",
  "🎁 Free Roblox Codes Updated Daily",
  "⚔️ Blox Fruits · Adopt Me · Doors · MM2 · and More",
];

const clerkAppearance = {
  variables: {
    colorBackground: "#0B0E17",
    colorText: "#ffffff",
    colorTextSecondary: "#8892a4",
    colorInputBackground: "#161b27",
    colorInputText: "#ffffff",
    colorPrimary: "#00F5A0",
  },
  elements: {
    card: { background: "#0B0E17", border: "1px solid #1e2433" },
    userButtonPopoverCard: { background: "#0B0E17", border: "1px solid #1e2433" },
    userButtonPopoverActionButton: { color: "#8892a4", "&:hover": { background: "#161b27", color: "#ffffff" } },
    userButtonPopoverActionButtonText: { color: "#8892a4" },
    userButtonPopoverActionButtonIcon: { color: "#8892a4" },
    userButtonPopoverFooter: { background: "#0B0E17" },
    userPreviewMainIdentifier: { color: "#ffffff" },
    userPreviewSecondaryIdentifier: { color: "#8892a4" },
  }
};

export default function Nav() {
  const { isSignedIn, user } = useUser();
  const [streak, setStreak] = useState<number | null>(null);
  const [flagCount, setFlagCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = ADMIN_USER_IDS.includes(user?.id || "");

  useEffect(() => {
    if (!user?.id) { setStreak(null); return; }
    fetch(`/api/streak?userId=${user.id}`)
      .then(r => r.json())
      .then(data => setStreak(data.streak));
  }, [user?.id]);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/flags/count")
      .then(r => r.json())
      .then(data => setFlagCount(data.count || 0));
  }, [isAdmin]);

  return (
    <>
      {/* Scrolling ticker banner */}
      <div style={{
        position: "sticky", top: 0, zIndex: 101,
        background: "linear-gradient(90deg, #0d0118, #1a0030, #0d0118)",
        borderBottom: "1px solid rgba(184,76,255,0.3)",
        overflow: "hidden",
        height: 34,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "ticker 40s linear infinite",
        }}>
          {[0, 1].map(n => (
            <span key={n} style={{ fontSize: 12, fontWeight: 800, color: "#B84CFF", paddingRight: 80, letterSpacing: 0.3 }}>
              {TICKER_ITEMS.map((item, i) => (
                <span key={i}>
                  <span style={{ color: "#B84CFF" }}>{item}</span>
                  {i < TICKER_ITEMS.length - 1 && (
                    <span style={{ color: "rgba(255,60,172,0.5)", margin: "0 20px" }}>•</span>
                  )}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <nav style={{
        position: "sticky", top: 34, zIndex: 100,
        background: "rgba(11,14,23,0.85)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px"
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 68
        }}>
          {/* Logo */}
          <a href="/" style={{
            fontFamily: "var(--font-display)",
            fontSize: 28, textDecoration: "none",
            background: "var(--gradient-main)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", flexShrink: 0,
          }}>
            Blox<span style={{
              background: "var(--gradient-fire)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Quiz</span>
          </a>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href="/browse" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Quizzes</a>
            <a href="/codes" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Codes</a>
            <a href="/leaderboard" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Leaderboard</a>

            {isSignedIn && (
              <a href="/profile" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>My Profile</a>
            )}

            {isSignedIn && isAdmin && (
              <a href="/admin" style={{ position: "relative", textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>
                🛡️ Admin
                {flagCount > 0 && (
                  <span style={{ position: "absolute", top: 2, right: 2, background: "var(--neon-pink)", color: "#fff", fontSize: 10, fontWeight: 900, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", WebkitTextFillColor: "#fff" }}>{flagCount}</span>
                )}
              </a>
            )}

            {isSignedIn && streak !== null && streak > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface)", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 800, color: "var(--neon-yellow)", border: "1px solid rgba(255,227,71,0.2)" }}>{"🔥 " + streak + " Day Streak"}</div>
            )}

            {isSignedIn ? (
              <UserButton
                appearance={{ ...clerkAppearance, elements: { ...clerkAppearance.elements, avatarBox: { width: 36, height: 36 } } }}
              />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "8px 20px", borderRadius: 100, border: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--font-body)" }}>Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 800, fontSize: 14, padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)" }}>Sign Up</button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div className="mobile-nav" style={{ display: "none", alignItems: "center", gap: 10 }}>
            {isSignedIn ? (
              <UserButton
                appearance={{ ...clerkAppearance, elements: { ...clerkAppearance.elements, avatarBox: { width: 32, height: 32 } } }}
              />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 13, padding: "7px 14px", borderRadius: 100, border: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--font-body)" }}>Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 800, fontSize: 13, padding: "7px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)" }}>Sign Up</button>
                </SignUpButton>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "var(--text)", fontSize: 20 }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-nav" style={{
            display: "flex", flexDirection: "column", gap: 4,
            padding: "12px 24px 20px",
            borderTop: "1px solid var(--border)",
            background: "rgba(11,14,23,0.97)",
          }}>
            <a href="/browse" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>🎮 Quizzes</a>
            <a href="/codes" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>🎁 Codes</a>
            <a href="/leaderboard" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>🏆 Leaderboard</a>
            {isSignedIn && (
              <a href="/profile" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>👤 My Profile</a>
            )}
            {isSignedIn && isAdmin && (
              <a href="/admin" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>🛡️ Admin</a>
            )}
            {isSignedIn && streak !== null && streak > 0 && (
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--neon-yellow)", padding: "10px 0" }}>{"🔥 " + streak + " Day Streak"}</div>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}