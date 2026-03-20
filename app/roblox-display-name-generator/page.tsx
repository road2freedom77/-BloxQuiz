import DisplayNameClient from "./DisplayNameClient";

export const metadata = {
  title: "Roblox Display Name Generator (2026) — 1,000+ Cool & Aesthetic Ideas",
  description: "Generate the perfect Roblox display name. Aesthetic, cool, funny, edgy, cute and couple display name ideas — spaces and emojis allowed. Free to copy instantly.",
  alternates: { canonical: "https://www.bloxquiz.gg/roblox-display-name-generator" },
  openGraph: {
    title: "Roblox Display Name Generator (2026) — 1,000+ Cool & Aesthetic Ideas",
    description: "1,000+ Roblox display name ideas with spaces and emojis. Aesthetic, cool, funny, edgy and cute names — copy any instantly.",
    url: "https://www.bloxquiz.gg/roblox-display-name-generator",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export default function RobloxDisplayNamePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": "Roblox Display Name Generator", "item": "https://www.bloxquiz.gg/roblox-display-name-generator" },
        ]
      },
      {
        "@type": "Article",
        "headline": "1000+ Roblox Display Name Ideas (2026)",
        "description": "The ultimate list of Roblox display name ideas including aesthetic, cool, funny, edgy, cute and couple names with spaces and emojis.",
        "url": "https://www.bloxquiz.gg/roblox-display-name-generator",
        "publisher": { "@type": "Organization", "name": "BloxQuiz", "url": "https://www.bloxquiz.gg" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can Roblox display names have spaces?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes! Unlike usernames, Roblox display names can include spaces, making them much more creative. For example 'Shadow Blade' or 'lunar bloom' are both valid display names." }
          },
          {
            "@type": "Question",
            "name": "How long can a Roblox display name be?",
            "acceptedAnswer": { "@type": "Answer", "text": "Roblox display names can be up to 20 characters long, including spaces. They can contain letters, numbers, spaces, and some special characters." }
          },
          {
            "@type": "Question",
            "name": "How often can I change my Roblox display name?",
            "acceptedAnswer": { "@type": "Answer", "text": "You can change your Roblox display name for free once every 7 days. This is different from your username, which costs 1000 Robux to change." }
          },
          {
            "@type": "Question",
            "name": "What is the difference between a Roblox username and display name?",
            "acceptedAnswer": { "@type": "Answer", "text": "Your username is your permanent account ID used in your profile URL and costs 1000 Robux to change. Your display name is what other players see above your character in-game, can include spaces, and is free to change every 7 days." }
          },
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DisplayNameClient />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>
          Test Your Knowledge While You're Here
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, marginBottom: 20 }}>
          Got your display name? Now put your Roblox knowledge to the test with free quizzes for every game.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {[
            { slug: "blox-fruits", name: "Blox Fruits", emoji: "⚔️" },
            { slug: "brookhaven-rp", name: "Brookhaven RP", emoji: "🏠" },
            { slug: "adopt-me", name: "Adopt Me!", emoji: "🐾" },
            { slug: "murder-mystery-2", name: "Murder Mystery 2", emoji: "🔫" },
            { slug: "dress-to-impress", name: "Dress to Impress", emoji: "👗" },
            { slug: "bee-swarm-simulator", name: "Bee Swarm Simulator", emoji: "🐝" },
            { slug: "doors", name: "Doors", emoji: "🚪" },
            { slug: "tower-of-hell", name: "Tower of Hell", emoji: "🏗️" },
            { slug: "grow-a-garden", name: "Grow a Garden", emoji: "🌱" },
            { slug: "royale-high", name: "Royale High", emoji: "👑" },
          ].map(({ slug, name, emoji }) => (
            <a key={slug} href={`/games/${slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "var(--text)", fontWeight: 600, fontSize: 13 }}>
              <span style={{ fontSize: 20 }}>{emoji}</span>
              <span>{name}</span>
            </a>
          ))}
        </div>
        {/* Cross-link to other tools */}
        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/roblox-username-ideas" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>
            👤 Roblox Username Ideas
          </a>
          <a href="/roblox-bio-generator" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>
            ✍️ Roblox Bio Generator
          </a>
        </div>
      </div>
    </>
  );
}