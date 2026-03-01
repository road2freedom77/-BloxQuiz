import Hero from "./components/Hero";
import GameCategories from "./components/GameCategories";
import PopularQuizzes from "./components/PopularQuizzes";
import DailyChallenge from "./components/DailyChallenge";
import Codes from "./components/Codes";
import Leaderboard from "./components/Leaderboard";
import EmailSignup from "./components/EmailSignup";

export default function Home() {
  return (
    <>
      <Hero />
      <GameCategories />
      <PopularQuizzes />
      <DailyChallenge />
      <Codes />
      <Leaderboard />
      <EmailSignup />
    </>
  );
}