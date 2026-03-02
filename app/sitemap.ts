import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getAllQuizSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), "app/data/quizzes");
    return fs.readdirSync(dir)
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json", ""));
  } catch (e) {
    return [];
  }
}

function getAllGameSlugs(): string[] {
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

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.bloxquiz.gg";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/browse`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/leaderboard`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/codes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const staticQuizzes: MetadataRoute.Sitemap = [
    { url: `${base}/quiz/blox-fruits-ultimate`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/quiz/brookhaven-secrets`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/quiz/adopt-me-pets`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/quiz/which-roblox-game`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const dynamicQuizzes: MetadataRoute.Sitemap = getAllQuizSlugs().map(slug => ({
    url: `${base}/quiz/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const gamePages: MetadataRoute.Sitemap = getAllGameSlugs().map(slug => ({
    url: `${base}/games/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...staticQuizzes,
    ...dynamicQuizzes,
    ...gamePages,
  ];
}