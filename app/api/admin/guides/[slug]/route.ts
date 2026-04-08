import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase";
import { auth } from "@clerk/nextjs/server";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();

  const allowed = ["title", "meta_title", "meta_description", "excerpt", "difficulty", "status", "review_notes", "last_verified_at"];
  const update: Record<string, any> = { updated_at: new Date().toISOString() };

  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  // Set published_at when first publishing
  if (body.status === "published") {
    const { data: existing } = await supabaseAdmin
      .from("game_guides")
      .select("published_at")
      .eq("slug", slug)
      .single();
    if (!existing?.published_at) {
      update.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabaseAdmin
    .from("game_guides")
    .update(update)
    .eq("slug", slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}