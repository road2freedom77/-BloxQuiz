import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../../../lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("game_follows")
    .insert({ user_id: userId, game_slug: slug });

  if (error && error.code === "23505") {
    return NextResponse.json({ success: true, following: true }); // already following
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, following: true });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("game_follows")
    .delete()
    .eq("user_id", userId)
    .eq("game_slug", slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, following: false });
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ following: false });

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("game_follows")
    .select("id")
    .eq("user_id", userId)
    .eq("game_slug", slug)
    .maybeSingle();

  return NextResponse.json({ following: !!data });
}