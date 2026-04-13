import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function RandomQuiz() {
  try {
    const { data, count } = await supabase
      .from("quizzes")
      .select("slug", { count: "exact" })
      .eq("status", "published");

    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      redirect(`/quiz/${data[randomIndex].slug}`);
    }
  } catch (e) {}

  // Fallback
  redirect("/browse");
}