import { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";
import fs from "fs";
import path from "path";

function getAllJsonQuizSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), "app/data/quizzes");
    return fs.readdirSync(dir)
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json", ""));
  } catch (e) {
    return [];
  }
}

function getAllJsonGameSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    const games = new Set<string>();
    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (content.game) {
        const slug = content.game.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
        games.add(slug);
      }
    }
    return Array.from(games);
  } catch (e) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.bloxquiz.gg";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/browse`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/leaderboard`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/codes`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/roblox-username-ideas`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/champions`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/rules`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const jsonQuizzes: MetadataRoute.Sitemap = getAllJsonQuizSlugs().map(slug => ({
    url: `${base}/quiz/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const gamePages: MetadataRoute.Sitemap = getAllJsonGameSlugs().map(slug => ({
    url: `${base}/games/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Supabase generated quizzes
  let supabaseQuizzes: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase
      .from("quizzes")
      .select("slug, published_at");
    if (data) {
      supabaseQuizzes = data.map(q => ({
        url: `${base}/quiz/${q.slug}`,
        lastModified: new Date(q.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {}

  // Deduplicate — supabase slugs take priority over static
  const allQuizUrls = new Map<string, MetadataRoute.Sitemap[0]>();
  for (const q of jsonQuizzes) allQuizUrls.set(q.url, q);
  for (const q of supabaseQuizzes) allQuizUrls.set(q.url, q);

  return [
    ...staticPages,
    ...Array.from(allQuizUrls.values()),
    ...gamePages,
  ];
}