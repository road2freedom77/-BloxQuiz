import UsernameIdeasClient from "./UsernameIdeasClient";

export const metadata = {
  title: "Roblox Username Ideas (2026) — 1,100+ Cool, Funny & Aesthetic Names",
  description: "Find the perfect Roblox username from 1,100+ ideas. Cool, aesthetic, funny, tryhard, short, girl & boy names — all free to copy instantly. Updated 2026.",
  alternates: { canonical: "https://www.bloxquiz.gg/roblox-username-ideas" },
  openGraph: {
    title: "Roblox Username Ideas (2026) — 1,100+ Cool, Funny & Aesthetic Names",
    description: "1,100+ free Roblox username ideas. Cool, aesthetic, funny, tryhard, short names and more. Copy any name instantly.",
    url: "https://www.bloxquiz.gg/roblox-username-ideas",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export default function RobloxUsernameIdeasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": "Roblox Username Ideas", "item": "https://www.bloxquiz.gg/roblox-username-ideas" },
        ]
      },
      {
        "@type": "Article",
        "headline": "1000+ Roblox Username Ideas (2026)",
        "description": "The ultimate list of Roblox username ideas including cool, aesthetic, funny, tryhard, girl, boy and short names.",
        "url": "https://www.bloxquiz.gg/roblox-username-ideas",
        "publisher": { "@type": "Organization", "name": "BloxQuiz", "url": "https://www.bloxquiz.gg" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are some cool Roblox usernames?",
            "acceptedAnswer": { "@type": "Answer", "text": "Cool Roblox usernames include ShadowBlade, NovaKnight, VoidStrike, PhantomEdge, CrimsonWolf, ZenithSlayer, and StormBreaker. These names sound powerful and memorable." }
          },
          {
            "@type": "Question",
            "name": "What are some aesthetic Roblox usernames?",
            "acceptedAnswer": { "@type": "Answer", "text": "Aesthetic Roblox usernames include LunarBloom, VelvetNova, DreamPetal, CelestialRose, MoonlitSoul, and SilverMist. These names have a soft, beautiful feel." }
          },
          {
            "@type": "Question",
            "name": "How long can a Roblox username be?",
            "acceptedAnswer": { "@type": "Answer", "text": "Roblox usernames can be between 3 and 20 characters long. They can contain letters, numbers, and underscores, but cannot start with an underscore or number." }
          },
          {
            "@type": "Question",
            "name": "Can I change my Roblox username?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, you can change your Roblox username for 1000 Robux. Your display name can be changed for free every 7 days." }
          },
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UsernameIdeasClient />
      {/* Game hub cross-links */}
<div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>
    Find a Username for Your Favorite Game
  </h2>
  <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, marginBottom: 20 }}>
    Once you have your username, test your knowledge with free quizzes for every Roblox game.
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
      { slug: "arsenal", name: "Arsenal", emoji: "🎯" },
      { slug: "fisch", name: "Fisch", emoji: "🎣" },
      { slug: "anime-defenders", name: "Anime Defenders", emoji: "🐉" },
      { slug: "funky-friday", name: "Funky Friday", emoji: "🎵" },
      { slug: "berry-avenue", name: "Berry Avenue", emoji: "🍓" },
      { slug: "livetopia", name: "Livetopia", emoji: "🏖️" },
      { slug: "kick-off", name: "Kick Off", emoji: "⚽" },
      { slug: "natural-disaster-survival", name: "Natural Disaster Survival", emoji: "🌪️" },
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
