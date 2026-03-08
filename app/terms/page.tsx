export const metadata = {
    title: "Terms of Service — BloxQuiz",
    description: "BloxQuiz terms of service. Read our terms before using the platform.",
    robots: { index: false },
  };
  
  export default function TermsPage() {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 16 }}>
          {"Terms of Service 📋"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 600, marginBottom: 48 }}>
          Last updated: March 1, 2026
        </p>
  
        {[
          {
            title: "Acceptance of Terms",
            content: "By using BloxQuiz, you agree to these terms of service. If you do not agree, please do not use the platform."
          },
          {
            title: "Use of the Platform",
            content: "BloxQuiz is a free trivia platform for entertainment purposes. You agree not to abuse, exploit, or attempt to manipulate the platform, leaderboards, or scoring systems."
          },
          {
            title: "User Accounts",
            content: "You are responsible for maintaining the security of your account. You must not share your account with others or use another person's account without permission."
          },
          {
            title: "Content",
            content: "All quiz content on BloxQuiz is created for entertainment and educational purposes. We strive for accuracy but do not guarantee that all quiz answers are correct. Game mechanics change frequently."
          },
          {
            title: "Intellectual Property",
            content: "BloxQuiz is an independent fan site. All Roblox game names, logos, and related trademarks belong to their respective owners. BloxQuiz is not affiliated with Roblox Corporation."
          },
          {
            title: "Limitation of Liability",
            content: "BloxQuiz is provided as-is without warranties of any kind. We are not liable for any damages arising from your use of the platform."
          },
          {
            title: "Changes to Terms",
            content: "We may update these terms at any time. Continued use of BloxQuiz after changes constitutes acceptance of the new terms."
          }
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 12 }}>{title}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 600, lineHeight: 1.8 }}>{content}</p>
          </div>
        ))}
      </div>
    );
  }