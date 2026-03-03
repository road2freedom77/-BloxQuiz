import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "../../../lib/supabase";

const ADMIN_USER_ID = "user_3ALlHJlXwNoezsy7eoC7qAp6yTO";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await supabase.from("flags").update({ status: "dismissed" }).eq("id", id);
  return NextResponse.json({ success: true });
}