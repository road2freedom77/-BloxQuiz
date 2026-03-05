import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { robloxUsername, email, discord, seasonId } = await req.json();

  if (!robloxUsername || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check account is at least 24 hours old
  const { data: userRecord } = await supabase
    .from("users")
    .select("created_at")
    .eq("id", userId)
    .single();

  if (userRecord?.created_at) {
    const accountAge = Date.now() - new Date(userRecord.created_at).getTime();
    if (accountAge < 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: "Account must be at least 24 hours old to claim a prize." }, { status: 403 });
    }
  }

  // Check they actually have a pending prize
  const { data: prizeData } = await supabase
    .from("season_results")
    .select("rank, reward_status")
    .eq("user_id", userId)
    .eq("reward_status", "pending")
    .maybeSingle();

  if (!prizeData) {
    return NextResponse.json({ error: "No pending prize found." }, { status: 403 });
  }

  // Check not already claimed
  const { data: existing } = await supabase
    .from("prize_claims")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Prize already claimed." }, { status: 409 });
  }

  // Insert claim
  await supabase.from("prize_claims").insert({
    user_id: userId,
    season_id: seasonId,
    roblox_username: robloxUsername,
    email,
    discord: discord || null,
    submitted_at: new Date().toISOString(),
    status: "pending",
  });

  // Update season_results to claimed
  await supabase
    .from("season_results")
    .update({ reward_status: "claimed" })
    .eq("user_id", userId);

  return NextResponse.json({ success: true });
}