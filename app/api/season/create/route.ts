import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "../../../lib/supabase";

function getQuarterName(date: Date): string {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  const quarter = Math.floor(month / 3) + 1;
  return `Q${quarter} ${year}`;
}

function getQuarterDates(date: Date): { start: string; end: string } {
  const month = date.getMonth();
  const year = date.getFullYear();
  const quarterStart = Math.floor(month / 3) * 3; // 0, 3, 6, or 9

  const start = new Date(year, quarterStart, 1);
  const end = new Date(year, quarterStart + 3, 0); // last day of quarter

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export async function POST(req: Request) {
  try {
    const { startDate } = await req.json().catch(() => ({}));

    // Use provided date or today
    const baseDate = startDate ? new Date(startDate) : new Date();
    const name = getQuarterName(baseDate);
    const { start, end } = getQuarterDates(baseDate);

    // Check for existing season with same name
    const { data: existing } = await supabase
      .from("seasons")
      .select("id")
      .eq("name", name)
      .single();

    if (existing) {
      return NextResponse.json({ success: false, error: `Season "${name}" already exists` });
    }

    // Close any currently active seasons first
    await supabase
      .from("seasons")
      .update({ status: "closed" })
      .eq("status", "active");

    // Create the new season
    const { data, error } = await supabase
      .from("seasons")
      .insert({
        name,
        start_date: start,
        end_date: end,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, season: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}