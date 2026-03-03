import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "No slug" }, { status: 400 });

  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("slug", slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}