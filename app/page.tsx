import Hero from "./components/Hero";
import GameCategories from "./components/GameCategories";
import PopularQuizzes from "./components/PopularQuizzes";
import DailyChallenge from "./components/DailyChallenge";
import Codes from "./components/Codes";
import EmailSignup from "./components/EmailSignup";
import UsernameGeneratorBanner from "./components/UsernameGeneratorBanner";
import { supabase } from "./lib/supabase";
import fs from "fs";
import path from "path";

const DAILY_CHALLENGE_THRESHOLD = 50;

async function getInitialQuizzes() {
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json")).slice(0, 8);
    return files.map(file => {
      const data = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      return {
        slug: data.slug,
        title: data.title,
        game: data.game,
        difficulty: data.difficulty,
        questions: data.questions.length,
        emoji: "🎮",
        thumb: "linear-gradient(135deg, rgba(0,245,160,0.15), rgba(184,76,255,0.15))",
      };
    });
  } catch {
    return [];
  }
}

async function getInitialDaily() {
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json"));
    const today = new Date().toISOString().split("T")[0];
    const seed = today.replace(/-/g, "");
    const index = parseInt(seed) % files.length;
    const file = files[index];
    const data = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
    return {
      slug: data.slug,
      title: data.title,
      game: data.game,
      difficulty: data.difficulty,
      date: today,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const [initialQuizzes, initialDaily, { count: totalPlays }] = await Promise.all([
    getInitialQuizzes(),
    getInitialDaily(),
    supabase.from("plays").select("*", { count: "exact", head: true }),
  ]);

  const showDailyChallenge = (totalPlays ?? 0) >= DAILY_CHALLENGE_THRESHOLD;

  return (
    <>
      <Hero />
      <GameCategories />
      <UsernameGeneratorBanner />
      <PopularQuizzes initialQuizzes={initialQuizzes} />
      {showDailyChallenge && <DailyChallenge initialDaily={initialDaily} />}
      <Codes />
      <EmailSignup />
    </>
  );
}