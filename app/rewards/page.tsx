import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase";
import ClaimClient from "./ClaimClient";

export const metadata = {
  title: "Claim Your Prize | BloxQuiz.gg",
  description: "Claim your Roblox gift card prize from BloxQuiz.",
};

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };

async function getCurrentSeason() {
  const { data: active } = await supabase
    .from("seasons")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (active) return active;

  const { data: fallback } = await supabase
    .from("seasons")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return fallback;
}

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

  // Determine current season — claims are scoped to it
  const currentSeason = await getCurrentSeason();

  // Check for a pending prize in season_results, scoped to current season
  const { data: prizeData } = await supabase
    .from("season_results")
    .select("rank, reward_status, season_id, quizzes_completed")
    .eq("user_id", userId)
    .eq("season_id", currentSeason?.id || "")
    .eq("reward_status", "pending")
    .maybeSingle();

  // Check for existing claim, scoped to current season
  const { data: existingClaim } = await supabase
    .from("prize_claims")
    .select("id, status, submitted_at")
    .eq("user_id", userId)
    .eq("season_id", currentSeason?.id || "")
    .maybeSingle();

  const prizeAmount = prizeData ? PRIZE_AMOUNTS[prizeData.rank] || null : null;

  return (
    <ClaimClient
      username={username}
      prizeData={prizeData}
      existingClaim={existingClaim}
      prizeAmount={prizeAmount}
      seasonName={currentSeason?.name || "Current Season"}
    />
  );
}