import GroupNameClient from "./GroupNameClient";

export const metadata = {
  title: "Roblox Group & Clan Name Generator (2026) — 1,000+ Cool Ideas",
  description: "Find the perfect Roblox group or clan name. Cool, military, anime, roleplay, and gaming clan names — all free to copy instantly. 1,000+ ideas across 8 categories.",
  alternates: { canonical: "https://www.bloxquiz.gg/roblox-group-name-generator" },
  openGraph: {
    title: "Roblox Group & Clan Name Generator (2026) — 1,000+ Cool Ideas",
    description: "1,000+ Roblox group and clan name ideas. Military, anime, roleplay, gaming, and more — copy any instantly.",
    url: "https://www.bloxquiz.gg/roblox-group-name-generator",
    siteName: "BloxQuiz",
    type: "website",
  },
};

export default function RobloxGroupNamePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Roblox Group Name Generator", item: "https://www.bloxquiz.gg/roblox-group-name-generator" },
        ],
      },
      {
        "@type": "Article",
        headline: "1,000+ Roblox Group & Clan Name Ideas (2026)",
        description: "The ultimate list of Roblox group and clan name ideas including military, anime, roleplay, gaming, and aesthetic clan names.",
        url: "https://www.bloxquiz.gg/roblox-group-name-generator",
        publisher: { "@type": "Organization", name: "BloxQuiz", url: "https://www.bloxquiz.gg" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I create a group on Roblox?",
            acceptedAnswer: { "@type": "Answer", text: "To create a Roblox group, go to the Groups page on Roblox.com and click 'Create Group'. It costs 100 Robux to create a group. You can then customize your group name, description, logo, and roles." },
          },
          {
            "@type": "Question",
            name: "Can I change my Roblox group name?",
            acceptedAnswer: { "@type": "Answer", text: "Yes, Roblox group owners can change their group name. However, name changes may require Robux and are subject to Roblox's moderation policies. Choose your name carefully before creating the group." },
          },
          {
            "@type": "Question",
            name: "How long can a Roblox group name be?",
            acceptedAnswer: { "@type": "Answer", text: "Roblox group names can be up to 50 characters long and can include spaces, letters, numbers, and some special characters. Group names cannot contain inappropriate content." },
          },
          {
            "@type": "Question",
            name: "What makes a good Roblox clan name?",
            acceptedAnswer: { "@type": "Answer", text: "A good Roblox clan name is memorable, easy to spell, and reflects your group's style or game focus. Short names (2-3 words) tend to work best. Many clans also use abbreviations or tags like [TAG] that members add to their usernames." },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GroupNameClient />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>
          Test Your Roblox Knowledge
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, marginBottom: 20 }}>
          Got your group name? Now put your Roblox knowledge to the test with free quizzes for every game.
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
          <a href="/roblox-bio-generator" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", textDecoration: "none", color: "var(--text)", fontWeight: 700, fontSize: 13 }}>
            ✍️ Bio Generator
          </a>
        </div>
      </div>
    </>
  );
}