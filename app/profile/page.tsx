import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const username = user.username || user.firstName || user.id;
  redirect(`/profile/${username}`);
}