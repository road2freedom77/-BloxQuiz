import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  const { userId, reason, seasonId } = await req.json();

  await supabase
    .from("users")
    .update({ disqualified: true, flag_reason: reason })
    .eq("id", userId);

  if (seasonId) {
    await supabase.from("season_results").upsert({
      season_id: seasonId,
      user_id: userId,
      reward_status: "disqualified",
      disqualify_reason: reason,
    }, { onConflict: "season_id,user_id" });
  }

  return NextResponse.json({ success: true });
}