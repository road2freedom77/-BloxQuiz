import BioGeneratorClient from "./BioGeneratorClient";

export const metadata = {
  title: "Roblox Bio Generator (2026) — Free About Me Ideas for Your Profile",
  description: "Generate the perfect Roblox bio for your profile. Aesthetic, funny, edgy, chill, gamer and cute About Me ideas — free to copy instantly. Updated 2026.",
  alternates: { canonical: "https://www.bloxquiz.gg/roblox-bio-generator" },
  openGraph: {
    title: "Roblox Bio Generator (2026) — Free About Me Ideas for Your Profile",
    description: "Free Roblox bio generator. Aesthetic, funny, edgy, chill, gamer and cute About Me ideas for your Roblox profile. Copy instantly.",
    url: "https://www.bloxquiz.gg/roblox-bio-generator",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export default function RobloxBioGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": "Roblox Bio Generator", "item": "https://www.bloxquiz.gg/roblox-bio-generator" },
        ]
      },
      {
        "@type": "Article",
        "headline": "Roblox Bio Generator — Free About Me Ideas (2026)",
        "description": "Generate aesthetic, funny, edgy, chill, gamer and cute Roblox bios for your profile About Me section.",
        "url": "https://www.bloxquiz.gg/roblox-bio-generator",
        "publisher": { "@type": "Organization", "name": "BloxQuiz", "url": "https://www.bloxquiz.gg" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What should I put in my Roblox bio?",
            "acceptedAnswer": { "@type": "Answer", "text": "Your Roblox bio (About Me section) should reflect your personality. Popular ideas include your favorite games, your playstyle, a funny quote, aesthetic text, or your friend code. Keep it short and memorable." }
          },
          {
            "@type": "Question",
            "name": "How long can a Roblox bio be?",
            "acceptedAnswer": { "@type": "Answer", "text": "Roblox bios can be up to 1,000 characters long. Most players keep theirs short and punchy — a few lines at most. Quality over quantity." }
          },
          {
            "@type": "Question",
            "name": "Can I use emojis in my Roblox bio?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, emojis work great in Roblox bios and are very popular. They help break up text and add personality to your profile." }
          },
          {
            "@type": "Question",
            "name": "How do I add a bio on Roblox?",
            "acceptedAnswer": { "@type": "Answer", "text": "Go to your Roblox profile, click the pencil/edit icon next to your About section, type your bio, and save. You can update it as often as you like." }
          },
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BioGeneratorClient />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>
          More Free Roblox Tools
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, marginBottom: 20 }}>
          Got your bio? Check out our other free tools and quizzes.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <a href="/roblox-username-ideas" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>👤 Username Ideas</a>
          <a href="/roblox-display-name-generator" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>✨ Display Name Generator</a>
          <a href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>🎮 Take a Quiz</a>
        </div>
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
      </div>
    </>
  );
}