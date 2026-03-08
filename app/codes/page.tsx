import { codesData, LAST_UPDATED } from "../data/codes";
import CodesHubClient from "./CodesHubClient";

export const metadata = {
  title: `Roblox Codes 2026 — Active & Updated Daily | BloxQuiz`,
  description: "All active Roblox codes for 2026. Blox Fruits, Adopt Me, Murder Mystery 2, Doors, Anime Defenders and more. Updated daily — redeem before they expire!",
  alternates: { canonical: "https://www.bloxquiz.gg/codes" },
  openGraph: {
    title: "Roblox Codes 2026 — Active & Updated Daily | BloxQuiz",
    description: "All active Roblox codes for 2026. Updated daily — redeem before they expire!",
    url: "https://www.bloxquiz.gg/codes",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export default function CodesPage() {
  const games = codesData;
  const totalActive = games.reduce((acc, g) => acc + g.codes.filter(c => c.active).length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": "Roblox Codes", "item": "https://www.bloxquiz.gg/codes" },
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I redeem Roblox codes?",
            "acceptedAnswer": { "@type": "Answer", "text": "Each Roblox game has its own code redemption system. Generally, look for a Twitter bird icon, Codes button, or Settings menu inside the game. Enter the code exactly as shown and press Redeem." }
          },
          {
            "@type": "Question",
            "name": "Do Roblox codes expire?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, Roblox codes expire. Most codes are time-limited and expire after a few days or weeks. Redeem codes as soon as possible to avoid missing out on free rewards." }
          },
          {
            "@type": "Question",
            "name": "Where can I find new Roblox codes?",
            "acceptedAnswer": { "@type": "Answer", "text": "New Roblox codes are released by game developers on their Twitter/X accounts, Discord servers, and YouTube channels. BloxQuiz updates this page daily with the latest active codes." }
          },
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        <nav style={{ marginBottom: 20 }}>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
            <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
            <li>›</li>
            <li style={{ color: "var(--text)" }}>Roblox Codes</li>
          </ol>
        </nav>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", marginBottom: 12 }}>
            {"🎁 Roblox Game Codes — Active & Updated Daily"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 16, maxWidth: 600, margin: "0 auto 20px", lineHeight: 1.7 }}>
            Roblox codes give players free rewards such as coins, boosts, skins, and special items inside their favorite games. Many popular Roblox games release new codes during updates, events, or milestones. On this page you can find active Roblox codes for games like Blox Fruits, Adopt Me, Brookhaven RP, Doors, and many more. Codes often expire quickly — redeem them as soon as possible!
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ background: "rgba(0,245,160,0.12)", color: "var(--neon-green)", fontWeight: 800, fontSize: 13, padding: "8px 20px", borderRadius: 100 }}>{"✅ " + totalActive + " Active Codes"}</span>
            <span style={{ background: "rgba(184,76,255,0.12)", color: "#B84CFF", fontWeight: 800, fontSize: 13, padding: "8px 20px", borderRadius: 100 }}>{"🎮 " + games.length + " Games Covered"}</span>
            <span style={{ background: "rgba(255,227,71,0.12)", color: "var(--neon-yellow)", fontWeight: 800, fontSize: 13, padding: "8px 20px", borderRadius: 100 }}>{"🔄 Updated Daily"}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>
            {"🕐 Last updated: " + LAST_UPDATED + " — codes verified and refreshed"}
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px 32px", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"How To Redeem Roblox Codes"}</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, marginBottom: 16 }}>
            Each Roblox game has its own code system, but the general process is the same. Follow these steps to redeem codes in most Roblox games:
          </p>
          <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Launch the Roblox game on your device",
              "Look for a Twitter bird icon, Codes button, or Settings menu inside the game",
              "Click it to open the code redemption menu",
              "Type the code exactly as shown — codes are case sensitive",
              "Press Redeem or Enter to claim your free reward",
            ].map((step, i) => (
              <li key={i} style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
          <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginTop: 16, fontStyle: "italic" }}>
            ⚠️ Codes expire fast — redeem them as soon as you find them. Each game page below has specific redemption steps.
          </p>
        </div>

        <CodesHubClient games={games} />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>{"Frequently Asked Questions"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "Do Roblox codes expire?", a: "Yes — most Roblox codes are time-limited and expire after a few days or weeks. Some codes expire after a certain number of uses. Always redeem codes as soon as possible to avoid missing out." },
              { q: "Are these codes free?", a: "Yes — all codes listed on BloxQuiz are completely free. You never need to pay to use a Roblox code. If a site asks you to pay for codes, it's a scam." },
              { q: "Why isn't my code working?", a: "Codes are case sensitive — make sure you type them exactly as shown. The code may also have expired or already been redeemed on your account. Check the active/expired status on each game's page." },
              { q: "How often are new codes released?", a: "New codes are typically released during game updates, milestones, collaborations, or special events. Follow game developers on Twitter/X and Discord for the fastest code announcements." },
              { q: "Can I use the same code twice?", a: "No — each code can only be redeemed once per account. Attempting to use a code you've already redeemed will show an error." },
            ].map((faq, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "18px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>{"🎮 Test Your Roblox Knowledge"}</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 20px" }}>
            Now that you've redeemed your codes, put your Roblox knowledge to the test! BloxQuiz has free trivia quizzes for all your favorite Roblox games.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>🎮 Browse All Quizzes</a>
            <a href="/games/blox-fruits" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>⚔️ Blox Fruits Quizzes</a>
            <a href="/games/adopt-me" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>🐾 Adopt Me Quizzes</a>
          </div>
        </div>

      </div>
    </>
  );
}