import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { count } = await supabase
    .from("flags")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");
  return NextResponse.json({ count: count || 0 });
}