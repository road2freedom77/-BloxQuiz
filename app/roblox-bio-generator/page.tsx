import BioGeneratorClient from "./BioGeneratorClient";

export const metadata = {
  title: "Roblox Bio Generator (2026) — 500+ Cool & Aesthetic Profile Bios",
  description: "Generate the perfect Roblox profile bio. Aesthetic, cool, funny, edgy, cute and gamer bios — copy instantly and stand out on your profile. Free.",
  alternates: { canonical: "https://www.bloxquiz.gg/roblox-bio-generator" },
  openGraph: {
    title: "Roblox Bio Generator (2026) — 500+ Cool & Aesthetic Profile Bios",
    description: "500+ Roblox bio ideas for every style. Aesthetic, cool, funny, edgy and cute bios — copy any instantly.",
    url: "https://www.bloxquiz.gg/roblox-bio-generator",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export default function RobloxBioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Roblox Bio Generator", item: "https://www.bloxquiz.gg/roblox-bio-generator" },
        ],
      },
      {
        "@type": "Article",
        headline: "500+ Roblox Bio Ideas (2026)",
        description: "The ultimate list of Roblox profile bio ideas including aesthetic, cool, funny, edgy, cute and gamer bios.",
        url: "https://www.bloxquiz.gg/roblox-bio-generator",
        publisher: { "@type": "Organization", name: "BloxQuiz", url: "https://www.bloxquiz.gg" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How long can a Roblox bio be?",
            acceptedAnswer: { "@type": "Answer", text: "Roblox profile bios can be up to 1000 characters long. You can include spaces, line breaks, emojis, and most special characters to make your bio stand out." },
          },
          {
            "@type": "Question",
            name: "Can I use emojis in my Roblox bio?",
            acceptedAnswer: { "@type": "Answer", text: "Yes! Roblox profile bios support emojis and special characters. Using emojis is a great way to add personality and visual flair to your bio." },
          },
          {
            "@type": "Question",
            name: "How do I add a bio to my Roblox profile?",
            acceptedAnswer: { "@type": "Answer", text: "Go to your Roblox profile page, click the Edit button near your avatar, then find the About section. Type or paste your bio and save. Your bio will be visible to anyone who visits your profile." },
          },
          {
            "@type": "Question",
            name: "What should I put in my Roblox bio?",
            acceptedAnswer: { "@type": "Answer", text: "Your Roblox bio can include your favorite games, your playstyle, fun facts about yourself, your age or timezone, social links, or just a cool quote. Keep it personal and true to your vibe." },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BioGeneratorClient />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>
          Test Your Knowledge While You're Here
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, marginBottom: 20 }}>
          Got your bio? Now put your Roblox knowledge to the test with free quizzes for every game.
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
        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/roblox-username-ideas" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>
            👤 Roblox Username Ideas
          </a>
          <a href="/roblox-display-name-generator" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>
            ✨ Display Name Generator
          </a>
        </div>
      </div>
    </>
  );
}