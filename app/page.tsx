import Hero from "./components/Hero";
import GameCategories from "./components/GameCategories";
import PopularQuizzes from "./components/PopularQuizzes";
import DailyChallenge from "./components/DailyChallenge";
import Codes from "./components/Codes";
import Leaderboard from "./components/Leaderboard";
import EmailSignup from "./components/EmailSignup";
import { supabase } from "./lib/supabase";
import fs from "fs";
import path from "path";

async function getInitialStats() {
  try {
    const { count: quizzesPlayed } = await supabase
      .from("plays")
      .select("*", { count: "exact", head: true });

    const { count: players } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const totalQuizzes = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json")).length;

    return {
      quizzesPlayed: quizzesPlayed || 0,
      players: players || 0,
      totalQuizzes,
      gamesCovered: 6,
    };
  } catch {
    return { quizzesPlayed: 0, players: 0, totalQuizzes: 19, gamesCovered: 6 };
  }
}

export default async function Home() {
  const initialStats = await getInitialStats();

  return (
    <>
      <Hero initialStats={initialStats} />
      <GameCategories />
      <PopularQuizzes />
      <DailyChallenge />
      <Codes />
      <Leaderboard />
      <EmailSignup />
    </>
  );
}