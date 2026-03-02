import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const gameEmojis: Record<string, string> = {
  "Blox Fruits": "⚔️",
  "Brookhaven RP": "🏠",
  "Adopt Me!": "🐾",
  "Tower of Hell": "🗼",
  "Murder Mystery 2": "🔫",
  "Grow a Garden": "🌱",
};

const diffColors: Record<string, string> = {
  Easy: "#00F5A0",
  Medium: "#FFE347",
  Hard: "#FF3CAC",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let quiz: any = null;
  try {
    const filePath = path.join(process.cwd(), `app/data/quizzes/${slug}.json`);
    quiz = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    quiz = { title: "Roblox Quiz", game: "Roblox", difficulty: "Medium" };
  }

  const emoji = gameEmojis[quiz.game] || "🎮";
  const diffColor = diffColors[quiz.difficulty] || "#FFE347";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0E17",
          position: "relative",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Top gradient border */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 6,
          background: "linear-gradient(90deg, #00F5A0, #B84CFF, #FF3CAC)",
          display: "flex",
        }} />

        {/* Glow effect */}
        <div style={{
          position: "absolute",
          top: "20%", left: "50%",
          width: 600, height: 400,
          background: "radial-gradient(circle, rgba(0,245,160,0.1) 0%, transparent 70%)",
          transform: "translateX(-50%)",
          display: "flex",
        }} />

        {/* Game emoji */}
        <div style={{ fontSize: 80, marginBottom: 16, display: "flex" }}>{emoji}</div>

        {/* Game + difficulty badges */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{
            background: "rgba(0,217,255,0.15)",
            color: "#00D9FF",
            padding: "6px 20px",
            borderRadius: 100,
            fontSize: 22,
            fontWeight: 800,
            display: "flex",
          }}>{quiz.game}</div>
          <div style={{
            background: "rgba(0,0,0,0.3)",
            color: diffColor,
            padding: "6px 20px",
            borderRadius: 100,
            fontSize: 22,
            fontWeight: 800,
            border: `2px solid ${diffColor}`,
            display: "flex",
          }}>{quiz.difficulty}</div>
        </div>

        {/* Quiz title */}
        <div style={{
          fontSize: 52,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.2,
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>{quiz.title}</div>

        {/* CTA */}
        <div style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 32,
          display: "flex",
        }}>
          {"10 questions • Free to play • No signup needed"}
        </div>

        {/* BloxQuiz branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#00F5A0" }}>BloxQuiz</span>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#FF3CAC" }}>.gg</span>
        </div>
      </div>
    ),
    { ...size }
  );
}