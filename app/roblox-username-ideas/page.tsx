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
    </>
  );
}
