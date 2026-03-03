import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) return NextResponse.json({ error: "No slug" }, { status: 400 });

  try {
    const filePath = path.join(process.cwd(), `app/data/quizzes/${slug}.json`);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return NextResponse.json(content);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}