export default function Footer() {
  const gameLinks = [
    { label: "Blox Fruits", href: "/games/blox-fruits" },
    { label: "Brookhaven", href: "/games/brookhaven" },
    { label: "Adopt Me!", href: "/games/adopt-me" },
    { label: "Tower of Hell", href: "/games/tower-of-hell" },
    { label: "Murder Mystery 2", href: "/games/murder-mystery-2" },
  ];

  const featureLinks = [
    { label: "All Quizzes", href: "/browse" },
    { label: "Daily Challenge", href: "/#daily" },
    { label: "Roblox Codes", href: "/codes" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Username Generator", href: "/roblox-username-ideas" },
  ];

  const moreLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Advertise", href: "/advertise" },
  ];

  return (
    <>
      <footer style={{ maxWidth: 1200, margin: "60px auto 0", padding: "40px 24px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, position: "relative", zIndex: 1 }}>
        <div>
          <a href="/" style={{ fontFamily: "var(--font-display)", fontSize: 28, textDecoration: "none", background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Blox<span style={{ background: "var(--gradient-fire)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Quiz</span>
          </a>
          <p style={{ color: "var(--text-dim)", fontSize: 14, fontWeight: 600, marginTop: 12, lineHeight: 1.6 }}>The #1 Roblox trivia & quiz site. Test your knowledge, earn XP, and compete with friends. Not affiliated with Roblox Corporation.</p>
          <a href="https://x.com/BloxQuiz" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, textDecoration: "none", color: "var(--text-muted)", fontSize: 13, fontWeight: 800 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            @BloxQuiz
          </a>
        </div>
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 14 }}>Popular Games</h4>
          {gameLinks.map(({ label, href }) => (
            <a key={label} href={href} style={{ display: "block", textDecoration: "none", color: "var(--text-dim)", fontSize: 14, fontWeight: 600, padding: "3px 0" }}>{label}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 14 }}>Features</h4>
          {featureLinks.map(({ label, href }) => (
            <a key={label} href={href} style={{ display: "block", textDecoration: "none", color: "var(--text-dim)", fontSize: 14, fontWeight: 600, padding: "3px 0" }}>{label}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 14 }}>More</h4>
          {moreLinks.map(({ label, href }) => (
            <a key={label} href={href} style={{ display: "block", textDecoration: "none", color: "var(--text-dim)", fontSize: 14, fontWeight: 600, padding: "3px 0" }}>{label}</a>
          ))}
        </div>
      </footer>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-dim)", fontWeight: 600, position: "relative", zIndex: 1 }}>
        <span>© 2026 BloxQuiz — Not affiliated with Roblox Corporation</span>
        <span>Made with 💚 for the Roblox community</span>
      </div>
    </>
  );
}