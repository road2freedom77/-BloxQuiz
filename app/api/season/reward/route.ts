import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  const { userId, status, seasonId } = await req.json();

  if (seasonId) {
    await supabase.from("season_results").upsert({
      season_id: seasonId,
      user_id: userId,
      reward_status: status,
    }, { onConflict: "season_id,user_id" });
  }

  return NextResponse.json({ success: true });
}