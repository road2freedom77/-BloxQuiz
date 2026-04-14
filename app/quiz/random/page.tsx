import { redirect } from "next/navigation";
import { supabaseAdmin } from "../../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function RandomQuiz() {
  let slug = null;

  try {
    const { data } = await supabaseAdmin
      .from("quizzes")
      .select("slug")
      .eq("status", "published");

    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      slug = data[randomIndex].slug;
    }
  } catch (e) {}

  redirect(slug ? `/quiz/${slug}` : "/browse");
}