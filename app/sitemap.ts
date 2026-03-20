import { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";
import { supabaseAdmin } from "./lib/supabase";

function slugifyGame(game: string): string {
  return game.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.bloxquiz.gg";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/browse`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/leaderboard`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/codes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/roblox-username-ideas`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/roblox-display-name-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/roblox-bio-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },  
    { url: `${base}/champions`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/rules`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    // Stats hub and sub-pages
    { url: `${base}/stats`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/stats/most-played`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/stats/most-visited`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/stats/trending`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    // Stats category pages
    ...["roleplay","simulator","rpg","horror","obby","shooter","fashion","mystery","rhythm","sports","survival","tower-defense"].map(genre => ({
      url: `${base}/stats/category/${genre}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
  ];

  // Codes pages from code_games table
  let codesPages: MetadataRoute.Sitemap = [];
  try {
    const { data: codeGames } = await supabase
      .from("code_games")
      .select("slug, updated_at");
    if (codeGames) {
      codesPages = codeGames.map(g => ({
        url: `${base}/codes/${g.slug}`,
        lastModified: g.updated_at ? new Date(g.updated_at) : now,
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));
    }
  } catch (e) {}

  // Quiz pages from Supabase
  let quizPages: MetadataRoute.Sitemap = [];
  const gameSlugSet = new Set<string>();

  try {
    const { data } = await supabase
      .from("quizzes")
      .select("slug, game, published_at")
      .eq("status", "published");
    if (data) {
      quizPages = data.map(q => ({
        url: `${base}/quiz/${q.slug}`,
        lastModified: new Date(q.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
      for (const q of data) {
        if (q.game) gameSlugSet.add(slugifyGame(q.game));
      }
    }
  } catch (e) {}

  // Game hub pages
  const gamePages: MetadataRoute.Sitemap = Array.from(gameSlugSet).map(slug => ({
    url: `${base}/games/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Stats pages from roblox_games
  let statsPages: MetadataRoute.Sitemap = [];
  try {
    const { data: games } = await supabaseAdmin
      .from("roblox_games")
      .select("slug, last_updated")
      .eq("is_tracked", true);
    if (games) {
      const slugs = games.map((g: { slug: string }) => g.slug);

      // Individual stats pages
      statsPages = games.flatMap((g: { slug: string; last_updated: string | null }) => [
        {
          url: `${base}/stats/${g.slug}`,
          lastModified: g.last_updated ? new Date(g.last_updated) : now,
          changeFrequency: "hourly" as const,
          priority: 0.8,
        },
        {
          url: `${base}/stats/${g.slug}/history`,
          lastModified: g.last_updated ? new Date(g.last_updated) : now,
          changeFrequency: "daily" as const,
          priority: 0.6,
        },
      ]);

      // Compare pages — all pairs
      for (let i = 0; i < slugs.length; i++) {
        for (let j = i + 1; j < slugs.length; j++) {
          const [a, b] = [slugs[i], slugs[j]].sort();
          statsPages.push({
            url: `${base}/stats/compare/${a}-vs-${b}`,
            lastModified: now,
            changeFrequency: "hourly" as const,
            priority: 0.6,
          });
        }
      }
    }
  } catch (e) {}

  return [
    ...staticPages,
    ...codesPages,
    ...quizPages,
    ...gamePages,
    ...statsPages,
  ];
}