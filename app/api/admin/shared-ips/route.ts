import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../../../lib/supabase";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
  "user_3AjIcCtvCn5wdcF1RPZEhGV1RFj",
];

export async function GET() {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id, username, last_ip, is_flagged")
    .not("last_ip", "is", null);

  if (!users || users.length === 0) {
    return NextResponse.json({ results: [] });
  }

  // Group by IP
  const ipMap: Record<string, { id: string, username: string, is_flagged: boolean }[]> = {};
  for (const u of users) {
    if (!u.last_ip) continue;
    if (!ipMap[u.last_ip]) ipMap[u.last_ip] = [];
    ipMap[u.last_ip].push({ id: u.id, username: u.username, is_flagged: u.is_flagged });
  }

  // Only process IPs shared by more than one account
  const sharedEntries = Object.entries(ipMap).filter(([, accounts]) => accounts.length > 1);

  // Auto-flag all accounts sharing an IP that aren't already flagged
  for (const [ip, accounts] of sharedEntries) {
    const unflagged = accounts.filter(a => !a.is_flagged);
    for (const account of unflagged) {
      await supabaseAdmin
        .from("users")
        .update({
          is_flagged: true,
          flag_reason: `Shared IP (${ip}) with: ${accounts.filter(a => a.id !== account.id).map(a => a.username).join(", ")}`,
        })
        .eq("id", account.id);
    }
  }

  const results = sharedEntries
    .map(([ip, accounts]) => ({ ip, usernames: accounts.map(a => a.username) }))
    .sort((a, b) => b.usernames.length - a.usernames.length);

  return NextResponse.json({ results });
}