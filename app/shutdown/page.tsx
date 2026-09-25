// app/shutdown/page.tsx
// BloxQuiz shutdown announcement page. Every route on the site is rewritten
// here by middleware.ts until the site goes offline on the shutdown date.
export const metadata = {
  title: "BloxQuiz is Shutting Down",
  description: "BloxQuiz.gg is closing. Thank you to everyone who played.",
  robots: { index: false, follow: false },
};

const SHUTDOWN_DATE = "October 10, 2026";

export default function ShutdownPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0B0E17", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 620, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>👋</div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, color: "#F0F4FF", marginBottom: 20, lineHeight: 1.2 }}>
          BloxQuiz is Shutting Down
        </h1>
        <p style={{ fontSize: 16, color: "#8892B0", fontWeight: 600, lineHeight: 1.8, marginBottom: 28 }}>
          After a great run, BloxQuiz is closing its doors. The site will go offline on{" "}
          <strong style={{ color: "#FFE347" }}>{SHUTDOWN_DATE}</strong>.
        </p>

        <div style={{ background: "#13172A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", textAlign: "left", marginBottom: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#FF3CAC", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 14px" }}>What this means</p>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#8892B0", fontSize: 14, fontWeight: 600, lineHeight: 2 }}>
            <li>The Q3 2026 season is cancelled. No prizes will be awarded this season.</li>
            <li>All accounts, scores, and leaderboard data will be permanently deleted when the site goes offline.</li>
            <li>Quizzes and all other content will no longer be accessible after {SHUTDOWN_DATE}.</li>
          </ul>
        </div>

        <p style={{ fontSize: 15, color: "#8892B0", fontWeight: 600, lineHeight: 1.8, marginBottom: 28 }}>
          Thank you to everyone who played, competed, and made this community what it was. The engine that
          powered BloxQuiz lives on at{" "}
          <a href="https://www.faithblitz.com/" style={{ color: "#00F5A0", fontWeight: 800, textDecoration: "none" }}>
            FaithBlitz
          </a>
          {" "}— free Bible quizzes, daily challenges, and real prizes every season.
        </p>

        <a href="https://www.faithblitz.com/" style={{ display: "inline-block", background: "linear-gradient(135deg, #00F5A0, #B84CFF)", color: "#0B0E17", fontWeight: 900, fontSize: 15, padding: "14px 36px", borderRadius: 100, textDecoration: "none", marginBottom: 32 }}>
          Visit FaithBlitz →
        </a>

        <p style={{ fontSize: 13, color: "#4A5568", fontWeight: 600, margin: 0 }}>— Marcin</p>
      </div>
    </div>
  );
}