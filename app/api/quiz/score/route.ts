import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

const DIFFICULTY_MULTIPLIER: Record<string, number> = {
  Easy: 1,
  Medium: 1.5,
  Hard: 2,
};

const STREAK_BONUSES: Record<number, number> = {
  3: 25,
  7: 100,
  14: 200,
  30: 500,
};

const DAILY_SCORE_CAP = 20;

const MIN_SECONDS: Record<string, number> = {
  Easy: 30,
  Medium: 45,
  Hard: 60,
};

function getIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

async function checkAndFlag(userId: string, ip: string, difficulty: string, secondsSpent: number) {
  const flags: string[] = [];

  const minSeconds = MIN_SECONDS[difficulty] || 30;
  if (secondsSpent > 0 && secondsSpent < minSeconds) {
    flags.push(`Impossible speed — ${difficulty} quiz completed in ${secondsSpent}s (min ${minSeconds}s)`);
  }

  if (ip && ip !== "unknown") {
    const { data: otherScores } = await supabaseAdmin
      .from("scores")
      .select("user_id")
      .eq("ip_address", ip)
      .neq("user_id", userId)
      .limit(1);

    if (otherScores && otherScores.length > 0) {
      flags.push(`Shared IP with another account — possible multi-accounting`);
    }
  }

  if (flags.length === 0) return;

  const flagReason = flags.join(" | ");
  await supabaseAdmin
    .from("users")
    .update({ is_flagged: true, flag_reason: flagReason })
    .eq("id", userId)
    .eq("is_flagged", false);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const ip = getIP(req);

  const {
    slug,
    score: rawScore,
    totalQuestions,
    difficulty,
    game,
    startedAt,
  } = await req.json();

  if (!slug || rawScore === undefined || !totalQuestions || !difficulty) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const safeScore = Math.min(Math.max(0, Math.round(rawScore)), totalQuestions);
  const today = new Date().toISOString().split("T")[0];
  const month = today.substring(0, 7);
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty] || 1;
  const basePoints = safeScore * 10;
  const weightedScore = Math.round(basePoints * multiplier);
  const completedAt = new Date().toISOString();
  const secondsSpent = startedAt
    ? Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000)
    : 0;

  // Always log the play
  await supabase.from("plays").insert({
    quiz_slug: slug,
    score: safeScore,
    total_questions: totalQuestions,
  });

  // Anonymous play — no score tracking
  if (!userId) {
    return NextResponse.json({ success: true, anonymous: true });
  }

  // Fetch Clerk user for email and username
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
  const username = clerkUser?.username || clerkUser?.firstName || null;

  // Check daily cap
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from("scores")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("completed_at", todayStart.toISOString());
  const capped = (todayCount || 0) >= DAILY_SCORE_CAP;

  // Get user data
  const { data: userData } = await supabase
    .from("users")
    .select("streak, last_played, longest_streak, badges, monthly_score")
    .eq("id", userId)
    .single();

  // Calculate streak
  let newStreak = 1;
  if (userData?.last_played) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const lastPlayedDate = new Date(userData.last_played).toISOString().split("T")[0];
    const yesterdayDate = yesterday.toISOString().split("T")[0];
    if (lastPlayedDate === today) {
      newStreak = userData.streak;
    } else if (lastPlayedDate === yesterdayDate) {
      newStreak = (userData.streak || 0) + 1;
    } else {
      newStreak = 1;
    }
  }

  const streakBonus = (!capped && STREAK_BONUSES[newStreak]) ? STREAK_BONUSES[newStreak] : 0;
  const longestStreak = Math.max(newStreak, userData?.longest_streak || 0);

  const currentBadges: string[] = userData?.badges || [];
  const newBadges = [...currentBadges];
  if (newStreak >= 3 && !newBadges.includes("streak_3")) newBadges.push("streak_3");
  if (newStreak >= 7 && !newBadges.includes("streak_7")) newBadges.push("streak_7");
  if (newStreak >= 14 && !newBadges.includes("streak_14")) newBadges.push("streak_14");
  if (newStreak >= 30 && !newBadges.includes("streak_30")) newBadges.push("streak_30");

  const monthlyAdd = capped ? 0 : weightedScore + streakBonus;
  const xpGained = capped ? 0 : safeScore * 10;

  // Save score with IP
  await supabase.from("scores").insert({
    user_id: userId,
    quiz_slug: slug,
    score: safeScore,
    total_questions: totalQuestions,
    weighted_score: capped ? 0 : weightedScore,
    difficulty,
    month,
    started_at: startedAt || null,
    completed_at: completedAt,
    ip_address: ip,
  });

  // Update user — now includes email and username
  await supabase.from("users").upsert({
    id: userId,
    ...(username && { username }),
    ...(email && { email }),
    streak: newStreak,
    last_played: today,
    longest_streak: longestStreak,
    badges: newBadges,
    monthly_score: (userData?.monthly_score || 0) + monthlyAdd,
    last_ip: ip,
  }, { onConflict: "id" });

  if (xpGained > 0) {
    await supabase.rpc("increment_xp", { user_id: userId, amount: xpGained });
  }

  // Run cheat detection async — don't block response
  checkAndFlag(userId, ip, difficulty, secondsSpent).catch(console.error);

  return NextResponse.json({
    success: true,
    capped,
    weightedScore,
    streakBonus,
    newStreak,
    earnedPoints: capped ? 0 : weightedScore + streakBonus,
  });
}