import { supabase } from "../lib/supabase";
import LeaderboardClient from "./LeaderboardClient";

export const metadata = {
  title: "Leaderboard — Top Roblox Quiz Players | BloxQuiz",
  description: "See the top Roblox quiz players on BloxQuiz. Compete for XP, climb the ranks and earn badges. Updated live!",
  alternates: { canonical: "https://www.bloxquiz.gg/leaderboard" }
};

async function getLeaderboard() {
  const { data } = await supabase
    .from("users")
    .select("id, username, xp, streak")
    .order("xp", { ascending: false })
    .limit(50);

  return (data || []).map((u, i) => ({
    rank: i + 1,
    user_id: u.id,
    username: u.username,
    xp: u.xp || 0,
    streak: u.streak || 0,
  }));
}

export default async function LeaderboardPage() {
  const initialLeaderboard = await getLeaderboard();
  return <LeaderboardClient initialLeaderboard={initialLeaderboard} />;
}