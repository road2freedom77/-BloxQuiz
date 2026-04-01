import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase";
import ClaimClient from "./ClaimClient";

export const metadata = {
  title: "Claim Your Prize | BloxQuiz.gg",
  description: "Claim your Roblox gift card prize from BloxQuiz Season 1.",
};

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };

export default async function RewardsPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in?redirect_url=/rewards");

  const user = await currentUser();
  const clerkUsername = user?.username || user?.firstName || "Player";

  // Get BloxQuiz username
  const { data: userRecord } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .single();

  const username = userRecord?.username || clerkUsername;

  // Check for a pending prize in season_results
  const { data: prizeData } = await supabase
    .from("season_results")
    .select("rank, reward_status, season_id, quizzes_completed")
    .eq("user_id", userId)
    .eq("reward_status", "pending")
    .maybeSingle();

  // Check for existing claim
  const { data: existingClaim } = await supabase
    .from("prize_claims")
    .select("id, status, submitted_at")
    .eq("user_id", userId)
    .maybeSingle();

  const prizeAmount = prizeData ? PRIZE_AMOUNTS[prizeData.rank] || null : null;

  return (
    <ClaimClient
      username={username}
      prizeData={prizeData}
      existingClaim={existingClaim}
      prizeAmount={prizeAmount}
    />
  );
}