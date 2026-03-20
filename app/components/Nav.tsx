"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
];

const TOOLS = [
  { href: "/roblox-username-ideas", label: "Username Ideas", emoji: "👤" },
  { href: "/roblox-display-name-generator", label: "Display Name Generator", emoji: "✨" },
  { href: "/roblox-bio-generator", label: "Bio Generator", emoji: "✍️" },
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
    userButtonPopoverActionButton: { color: "#8892a4" },
    userButtonPopoverActionButtonText: { color: "#8892a4" },
    userButtonPopoverActionButtonIcon: { color: "#8892a4" },
    userButtonPopoverFooter: { background: "#0B0E17" },
    userPreviewMainIdentifier: { color: "#ffffff" },
    userPreviewSecondaryIdentifier: { color: "#8892a4" },
  },
};

export default function Nav() {
  const { isSignedIn, user } = useUser();
  const [streak, setStreak] = useState<number | null>(null);
  const [flagCount, setFlagCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,14,23,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <a href="/" style={{ fontFamily: "var(--font-display)", fontSize: 28, textDecoration: "none", background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", flexShrink: 0 }}>
            Blox<span style={{ background: "var(--gradient-fire)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Quiz</span>
          </a>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href="/browse" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Quizzes</a>
            <a href="/codes" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Codes</a>
            <a href="/stats" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Stats</a>
            <a href="/leaderboard" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Leaderboard</a>

            {/* Tools dropdown */}
            <div ref={toolsRef} style={{ position: "relative" }}>
              <button onClick={() => setToolsOpen(!toolsOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: toolsOpen ? "var(--neon-green)" : "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100, fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 4 }}>
                🛠️ Tools {toolsOpen ? "▲" : "▾"}
              </button>
              {toolsOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "rgba(11,14,23,0.97)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px", minWidth: 220, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 200 }}>
                  {TOOLS.map(tool => (
                    <a key={tool.href} href={tool.href} onClick={() => setToolsOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, textDecoration: "none", color: "var(--text-muted)", fontSize: 13, fontWeight: 700 }}>
                      <span>{tool.emoji}</span>
                      <span>{tool.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {isSignedIn && (
              <a href="/profile" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>My Profile</a>
            )}

            {isSignedIn && isAdmin && (
              <a href="/admin" style={{ position: "relative", textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>
                🛡️ Admin
                {flagCount > 0 && (
                  <span style={{ position: "absolute", top: 2, right: 2, background: "var(--neon-pink)", color: "#fff", fontSize: 10, fontWeight: 900, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", WebkitTextFillColor: "#fff" }}>
                    {flagCount}
                  </span>
                )}
              </a>
            )}

            {isSignedIn && streak !== null && streak > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface)", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 800, color: "var(--neon-yellow)", border: "1px solid rgba(255,227,71,0.2)" }}>
                {"🔥 " + streak + " Day Streak"}
              </div>
            )}

            {isSignedIn ? (
              <UserButton appearance={{ ...clerkAppearance, elements: { ...clerkAppearance.elements, avatarBox: { width: 36, height: 36 } } }} />
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
              <UserButton appearance={{ ...clerkAppearance, elements: { ...clerkAppearance.elements, avatarBox: { width: 32, height: 32 } } }} />
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
          <div className="mobile-nav" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 24px 20px", borderTop: "1px solid var(--border)", background: "rgba(11,14,23,0.97)" }}>
            <a href="/browse" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>🎮 Quizzes</a>
            <a href="/codes" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>🎁 Codes</a>
            <a href="/stats" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>📊 Stats</a>
            <a href="/leaderboard" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>🏆 Leaderboard</a>

            {/* Mobile Tools */}
            <button onClick={() => setMobileToolsOpen(!mobileToolsOpen)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>🛠️ Tools</span>
              <span style={{ fontSize: 12 }}>{mobileToolsOpen ? "▲" : "▾"}</span>
            </button>
            {mobileToolsOpen && (
              <div style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                {TOOLS.map(tool => (
                  <a key={tool.href} href={tool.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-dim)", fontSize: 14, fontWeight: 700, padding: "8px 0" }}>
                    {tool.emoji} {tool.label}
                  </a>
                ))}
              </div>
            )}

            {isSignedIn && <a href="/profile" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>👤 My Profile</a>}
            {isSignedIn && isAdmin && <a href="/admin" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, padding: "10px 0" }}>🛡️ Admin</a>}
            {isSignedIn && streak !== null && streak > 0 && (
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--neon-yellow)", padding: "10px 0" }}>{"🔥 " + streak + " Day Streak"}</div>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}