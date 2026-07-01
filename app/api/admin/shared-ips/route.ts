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
    .select("username, last_ip")
    .not("last_ip", "is", null);

  if (!users || users.length === 0) {
    return NextResponse.json({ results: [] });
  }

  // Group by IP
  const ipMap: Record<string, string[]> = {};
  for (const u of users) {
    if (!u.last_ip) continue;
    if (!ipMap[u.last_ip]) ipMap[u.last_ip] = [];
    ipMap[u.last_ip].push(u.username);
  }

  // Only return IPs shared by more than one account
  const results = Object.entries(ipMap)
    .filter(([, usernames]) => usernames.length > 1)
    .map(([ip, usernames]) => ({ ip, usernames }))
    .sort((a, b) => b.usernames.length - a.usernames.length);

  return NextResponse.json({ results });
}