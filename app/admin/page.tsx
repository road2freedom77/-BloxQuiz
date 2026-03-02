import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase";
import fs from "fs";
import path from "path";
import AdminClient from "./AdminClient";

const ADMIN_USER_ID = "user_3ALlHJlXwNoezsy7eoC7qAp6yTO";

async function getAllQuizzes() {
  const quizzes: any[] = [];
  try {
    const dir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      quizzes.push({
        slug: file.replace(".json", ""),
        title: content.title,
        game: content.game,
        difficulty: content.difficulty,
        questions: content.questions?.length || 0,
      });
    }
  } catch (e) {}
  return quizzes;
}

async function getStats() {
  const { count: totalPlays } = await supabase
    .from("plays")
    .select("*", { count: "exact", head: true });

  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: totalFlags } = await supabase
    .from("flags")
    .select("*", { count: "exact", head: true });

  return {
    totalPlays: totalPlays || 0,
    totalUsers: totalUsers || 0,
    totalFlags: totalFlags || 0,
  };
}

async function getFlags() {
  const { data } = await supabase
    .from("flags")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return data || [];
}

async function getTopQuizzes() {
  const { data } = await supabase
    .from("plays")
    .select("quiz_slug")
    .limit(1000);

  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.quiz_slug] = (counts[row.quiz_slug] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([slug, plays]) => ({ slug, plays }));
}

export default async function AdminPage() {
  const { userId } = await auth();

  if (userId !== ADMIN_USER_ID) redirect("/");

  const [quizzes, stats, flags, topQuizzes] = await Promise.all([
    getAllQuizzes(),
    getStats(),
    getFlags(),
    getTopQuizzes(),
  ]);

  return <AdminClient quizzes={quizzes} stats={stats} flags={flags} topQuizzes={topQuizzes} />;
}