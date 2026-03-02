import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import PublicProfileClient from "./PublicProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `${username}'s Profile | BloxQuiz`,
    description: `Check out ${username}'s Roblox quiz stats on BloxQuiz.gg!`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!userData) notFound();

  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userData.id)
    .order("played_at", { ascending: false })
    .limit(10);

  const { data: allUsers } = await supabase
    .from("users")
    .select("id, xp")
    .order("xp", { ascending: false });

  const rank = allUsers ? allUsers.findIndex(u => u.id === userData.id) + 1 : null;

  return (
    <PublicProfileClient
      userData={userData}
      scores={scores || []}
      rank={rank}
    />
  );
}