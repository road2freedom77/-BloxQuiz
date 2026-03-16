import Link from "next/link";

interface QuizCTAProps {
  gameName: string;
  gameSlug: string;
  gameEmoji: string | null;
  quizCount: number;
}

export default function QuizCTA({ gameName, gameSlug, gameEmoji, quizCount }: QuizCTAProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0d1f3c 0%, #0f2744 50%, #0d1f3c 100%)",
        border: "1px solid rgba(0,180,216,0.25)",
        borderRadius: 16,
        padding: "28px 32px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      {/* Left: text */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#00b4d8",
            marginBottom: 8,
          }}
        >
          🧠 Think You Know This Game?
        </div>
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 20,
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          Test Your {gameEmoji ? `${gameEmoji} ` : ""}{gameName} Knowledge
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.5,
          }}
        >
          {quizCount > 0
            ? `${quizCount} free quiz${quizCount !== 1 ? "zes" : ""} covering mechanics, lore, secrets, and more.`
            : "Free quizzes covering mechanics, lore, secrets, and more."}
        </p>
      </div>

      {/* Right: buttons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Link
          href={`/games/${gameSlug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            padding: "12px 24px",
            borderRadius: 100,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          🎮 Take the Quiz
        </Link>
        <Link
          href="/browse"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.7)",
            fontWeight: 700,
            fontSize: 14,
            padding: "12px 20px",
            borderRadius: 100,
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            whiteSpace: "nowrap",
          }}
        >
          Browse All
        </Link>
      </div>
    </div>
  );
}