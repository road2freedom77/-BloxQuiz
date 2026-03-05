import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "../../../lib/supabase";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { claimId, status } = await req.json();
  if (!claimId || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await supabase.from("prize_claims").update({ status }).eq("id", claimId);

  if (status === "sent") {
    const { data: claim } = await supabase
      .from("prize_claims")
      .select("user_id")
      .eq("id", claimId)
      .single();

    if (claim) {
      await supabase
        .from("season_results")
        .update({ reward_status: "sent" })
        .eq("user_id", claim.user_id);
    }
  }

  return NextResponse.json({ success: true });
}