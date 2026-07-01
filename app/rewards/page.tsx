import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase";
import ClaimClient from "./ClaimClient";

export const metadata = {
  title: "Claim Your Prize | BloxQuiz.gg",
  description: "Claim your Roblox gift card prize from BloxQuiz.",
};

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };

export default async function RewardsPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in?redirect_url=/rewards");

  const user = await currentUser();
  const clerkUsername = user?.username || user?.firstName || "Player";

  const { data: userRecord } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .single();

  const username = userRecord?.username || clerkUsername;

  // Find most recent pending prize across ALL seasons
  const { data: prizeData } = await supabase
    .from("season_results")
    .select("rank, reward_status, season_id, quizzes_completed")
    .eq("user_id", userId)
    .eq("reward_status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get season name for that prize
  let seasonName = "Current Season";
  if (prizeData?.season_id) {
    const { data: season } = await supabase
      .from("seasons")
      .select("name")
      .eq("id", prizeData.season_id)
      .single();
    seasonName = season?.name || "Current Season";
  }

  // Check for existing claim scoped to that specific season
  const { data: existingClaim } = await supabase
    .from("prize_claims")
    .select("id, status, submitted_at")
    .eq("user_id", userId)
    .eq("season_id", prizeData?.season_id || "")
    .maybeSingle();

  const prizeAmount = prizeData ? PRIZE_AMOUNTS[prizeData.rank] || null : null;

  return (
    <ClaimClient
      username={username}
      prizeData={prizeData}
      existingClaim={existingClaim}
      prizeAmount={prizeAmount}
      seasonName={seasonName}
    />
  );
}