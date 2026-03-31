import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

export async function POST(req: Request) {
  const { slug, questions, publish } = await req.json();

  if (!slug || !questions) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const updateData: any = { questions };
  if (publish) {
    updateData.status = "published";
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabaseAdmin
    .from("quizzes")
    .update(updateData)
    .eq("slug", slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}