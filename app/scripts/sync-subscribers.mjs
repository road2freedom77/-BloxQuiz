// One-time script to sync existing subscribers to Resend
// Run: node app/scripts/sync-subscribers.mjs

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

async function syncSubscribers() {
  console.log("Fetching subscribers from Supabase...");

  // Try common table names — update if yours is different
  const { data, error } = await supabase
    .from("users")
    .select("email")
    .not("email", "is", null);

  if (error) {
    console.error("Supabase error:", error.message);
    console.log("Try checking your table name — it might be 'emails', 'newsletter', etc.");
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("No subscribers found in Supabase.");
    process.exit(0);
  }

  console.log(`Found ${data.length} subscribers. Syncing to Resend...`);

  let added = 0;
  let failed = 0;

  for (const row of data) {
    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: row.email, unsubscribed: false }),
    });

    if (res.ok) {
      console.log(`✅ Added: ${row.email}`);
      added++;
    } else {
      const err = await res.json();
      console.log(`❌ Failed: ${row.email} — ${err.message}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone! Added: ${added}, Failed: ${failed}`);
}

syncSubscribers();
