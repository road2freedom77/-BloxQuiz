export const metadata = {
    title: "About BloxQuiz — The #1 Roblox Trivia Site",
    description: "Learn about BloxQuiz, the free Roblox trivia and quiz platform for fans of Blox Fruits, Adopt Me, Brookhaven and more.",
  };
  
  export default function AboutPage() {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", marginBottom: 16 }}>
          {"About BloxQuiz 🎮"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 18, fontWeight: 600, marginBottom: 48, lineHeight: 1.7 }}>
          The #1 free Roblox trivia and quiz platform for fans of every game.
        </p>
  
        {[
          {
            title: "What is BloxQuiz?",
            content: "BloxQuiz is a free Roblox trivia platform where fans can test their knowledge across the most popular Roblox games. From Blox Fruits to Adopt Me, Tower of Hell to Murder Mystery 2 — we have quizzes for every type of Roblox player."
          },
          {
            title: "Our Mission",
            content: "We want to make learning about Roblox games fun and competitive. Whether you're a casual player or a hardcore Roblox veteran, BloxQuiz gives you a way to prove your knowledge, earn XP, and compete on our global leaderboard."
          },
          {
            title: "How It Works",
            content: "Every quiz is 10 questions, completely free to play, and takes under 5 minutes. Sign up to save your scores, track your streak, and climb the leaderboard. New quizzes are added regularly across all your favorite games."
          },
          {
            title: "Not Affiliated with Roblox",
            content: "BloxQuiz is an independent fan site and is not affiliated with, endorsed by, or connected to Roblox Corporation in any way. Roblox and all related game names are trademarks of their respective owners."
          }
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12, color: "var(--neon-green)" }}>{title}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16, fontWeight: 600, lineHeight: 1.8 }}>{content}</p>
          </div>
        ))}
  
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 32, textAlign: "center", marginTop: 48 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>{"Ready to test your knowledge?"}</div>
          <a href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 15, padding: "14px 32px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
            {"Browse All Quizzes →"}
          </a>
        </div>
      </div>
    );
  }