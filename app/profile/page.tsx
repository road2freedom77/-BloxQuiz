import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // Get user data from Supabase
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get last 10 scores
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .limit(10);

  // Get leaderboard rank
  const { data: allUsers } = await supabase
    .from("users")
    .select("id, xp")
    .order("xp", { ascending: false });

  const rank = allUsers ? allUsers.findIndex(u => u.id === user.id) + 1 : null;

  return (
    <ProfileClient
      user={{
        id: user.id,
        username: user.username || user.firstName || "Anonymous",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl,
      }}
      userData={userData}
      scores={scores || []}
      rank={rank}
    />
  );
}