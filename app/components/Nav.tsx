"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Nav() {
  const { isSignedIn, user } = useUser();
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) { setStreak(null); return; }
    fetch(`/api/streak?userId=${user.id}`)
      .then(r => r.json())
      .then(data => setStreak(data.streak));
  }, [user?.id]);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
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
        <a href="/" style={{
          fontFamily: "var(--font-display)",
          fontSize: 28, textDecoration: "none",
          background: "var(--gradient-main)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Blox<span style={{
            background: "var(--gradient-fire)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Quiz</span>
        </a>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href="/browse" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Quizzes</a>
          <a href="/codes" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Codes</a>
          <a href="/#leaderboard" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Leaderboard</a>

          {/* Only show streak if signed in and has a streak */}
          {isSignedIn && streak !== null && streak > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--surface)", padding: "6px 14px",
              borderRadius: 100, fontSize: 13, fontWeight: 800,
              color: "var(--neon-yellow)",
              border: "1px solid rgba(255,227,71,0.2)"
            }}>🔥 {streak} Day Streak</div>
          )}

          {isSignedIn ? (
            <UserButton appearance={{
              elements: {
                avatarBox: { width: 36, height: 36 }
              }
            }} />
          ) : (
            <>
              <SignInButton mode="modal">
                <button style={{
                  background: "var(--surface)", color: "var(--text)",
                  fontWeight: 800, fontSize: 14,
                  padding: "8px 20px", borderRadius: 100,
                  border: "1px solid var(--border)", cursor: "pointer",
                  fontFamily: "var(--font-body)"
                }}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{
                  background: "var(--gradient-main)",
                  color: "var(--bg)", fontWeight: 800, fontSize: 14,
                  padding: "8px 20px", borderRadius: 100,
                  border: "none", cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  WebkitTextFillColor: "var(--bg)"
                }}>Sign Up</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}