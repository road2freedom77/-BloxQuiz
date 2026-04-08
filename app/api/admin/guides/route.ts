import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase";
import { auth } from "@clerk/nextjs/server";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
];

export async function GET() {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("game_guides")
    .select("id, slug, title, game_name, game_slug, difficulty, status, word_count, excerpt, meta_title, meta_description, review_notes, source_notes, last_verified_at, updated_at, content")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ guides: data });
}