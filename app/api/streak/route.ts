import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ streak: 0 });

  const { data } = await supabase
    .from("users")
    .select("streak, last_played")
    .eq("id", userId)
    .single();

  if (!data) return NextResponse.json({ streak: 0 });

  // Check if streak is still active
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split("T")[0];
  const lastPlayedDate = new Date(data.last_played).toISOString().split("T")[0];

  // Streak is active if played today or yesterday
  const streakActive = lastPlayedDate === today || lastPlayedDate === yesterdayDate;
  const streak = streakActive ? data.streak : 0;

  return NextResponse.json({ streak });
}