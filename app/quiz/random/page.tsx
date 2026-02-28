import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

export default function RandomQuiz() {
  const staticSlugs = [
    "blox-fruits-ultimate",
    "brookhaven-secrets",
    "adopt-me-pets",
    "which-roblox-game",
  ];

  // Get dynamic quiz slugs
  const dynamicSlugs: string[] = [];
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir);
    files.forEach(f => {
      if (f.endsWith(".json")) dynamicSlugs.push(f.replace(".json", ""));
    });
  } catch (e) {}

  const allSlugs = [...staticSlugs, ...dynamicSlugs];
  const randomSlug = allSlugs[Math.floor(Math.random() * allSlugs.length)];

  redirect(`/quiz/${randomSlug}`);
}