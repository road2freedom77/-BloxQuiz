import { MetadataRoute } from "next";
import { supabaseAdmin } from "./lib/supabase";

const BASE = "https://www.bloxquiz.gg";
const MIN_PLAYERS_FOR_COMPARE = 5000;
const MAX_COMPARE_GAMES = 45;

function slugifyGame(game: string): string {
  return game
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const STATIC_GENRES = [
  "roleplay", "simulator", "rpg", "horror", "obby",
  "shooter", "fashion", "mystery", "rhythm", "sports",
  "survival", "tower-defense",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ─── Static pages ─────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                      lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/browse`,                          lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/leaderboard`,                     lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE}/codes`,                           lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/codes/new`,                       lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/codes/recently-updated`,          lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/codes/expired`,                   lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/stats`,                           lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE}/stats/most-played`,               lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${BASE}/stats/most-visited`,              lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${BASE}/stats/trending`,                  lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/roblox-username-ideas`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/roblox-display-name-generator`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/roblox-bio-generator`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/roblox-group-name-generator`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/champions`,                       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/rules`,                           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`,                           lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`,                         lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`,                           lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/contact`,                         lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ...STATIC_GENRES.map(genre => ({
      url: `${BASE}/stats/category/${genre}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
  ];

  // ─── Codes pages ──────────────────────────────────────────────────
  let codesPages: MetadataRoute.Sitemap = [];
  try {
    const { data: codeGames } = await supabaseAdmin
      .from("code_games")
      .select("slug, updated_at");
    if (codeGames) {
      codesPages = codeGames.map(g => ({
        url: `${BASE}/codes/${g.slug}`,
        lastModified: g.updated_at ? new Date(g.updated_at) : now,
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));
    }
  } catch (_) {}

  // ─── Quiz + game hub pages ─────────────────────────────────────────
  let quizPages: MetadataRoute.Sitemap = [];
  let gameHubPages: MetadataRoute.Sitemap = [];
  try {
    const { data: quizzes } = await supabaseAdmin
      .from("quizzes")
      .select("slug, game, published_at")
      .eq("status", "published");
    if (quizzes) {
      quizPages = quizzes.map(q => ({
        url: `${BASE}/quiz/${q.slug}`,
        lastModified: new Date(q.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

      const uniqueGameSlugs = new Set(
        quizzes.filter(q => q.game).map(q => slugifyGame(q.game))
      );
      gameHubPages = Array.from(uniqueGameSlugs).map(slug => ({
        url: `${BASE}/games/${slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (_) {}

  // ─── Stats pages (individual + history) ───────────────────────────
  let statsPages: MetadataRoute.Sitemap = [];
  let comparePages: MetadataRoute.Sitemap = [];

  try {
    const { data: allGames } = await supabaseAdmin
      .from("roblox_games")
      .select("slug, last_updated, current_players")
      .eq("is_tracked", true)
      .order("current_players", { ascending: false });

    if (allGames) {
      // All tracked games get stats + history pages
      statsPages = allGames.flatMap(g => [
        {
          url: `${BASE}/stats/${g.slug}`,
          lastModified: g.last_updated ? new Date(g.last_updated) : now,
          changeFrequency: "hourly" as const,
          priority: 0.8,
        },
        {
          url: `${BASE}/stats/${g.slug}/history`,
          lastModified: g.last_updated ? new Date(g.last_updated) : now,
          changeFrequency: "daily" as const,
          priority: 0.6,
        },
      ]);

      // Compare pages — top 45 games with 5K+ concurrent players
      const comparePool = allGames
        .filter(g => (g.current_players ?? 0) >= MIN_PLAYERS_FOR_COMPARE)
        .slice(0, MAX_COMPARE_GAMES)
        .map(g => g.slug);

      for (let i = 0; i < comparePool.length; i++) {
        for (let j = i + 1; j < comparePool.length; j++) {
          const [a, b] = [comparePool[i], comparePool[j]].sort();
          comparePages.push({
            url: `${BASE}/stats/compare/${a}-vs-${b}`,
            lastModified: now,
            changeFrequency: "hourly" as const,
            priority: 0.6,
          });
        }
      }
    }
  } catch (_) {}

  return [
    ...staticPages,   // ~32 URLs (inc. codes/new, codes/recently-updated, codes/expired)
    ...codesPages,    // ~96 URLs
    ...quizPages,     // ~373 URLs
    ...gameHubPages,  // ~97 URLs
    ...statsPages,    // ~190 URLs (95 games × 2: stats + history)
    ...comparePages,  // ~990 URLs (top 45 games, 5K+ players, all pairs)
  ];
  // Target total: ~1,778 URLs
}