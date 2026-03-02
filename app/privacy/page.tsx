export const metadata = {
    title: "Privacy Policy — BloxQuiz",
    description: "BloxQuiz privacy policy. Learn how we collect, use and protect your data.",
  };
  
  export default function PrivacyPage() {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 16 }}>
          {"Privacy Policy 🔒"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 600, marginBottom: 48 }}>
          Last updated: March 1, 2026
        </p>
  
        {[
          {
            title: "Information We Collect",
            content: "When you create an account, we collect your email address and username. We also collect anonymous usage data such as quizzes played and scores to power our leaderboards and stats."
          },
          {
            title: "How We Use Your Information",
            content: "We use your information to save your quiz scores, track your XP and streaks, display your username on leaderboards, and send you occasional emails about new quizzes and codes if you have subscribed."
          },
          {
            title: "Cookies",
            content: "We use cookies to keep you signed in and to understand how visitors use our site. We may use third-party analytics tools such as Google Analytics to help us improve the site."
          },
          {
            title: "Third Party Services",
            content: "We use Clerk for authentication, Supabase for our database, and Vercel for hosting. These services have their own privacy policies. We do not sell your personal data to any third parties."
          },
          {
            title: "Children's Privacy",
            content: "BloxQuiz is intended for general audiences. We do not knowingly collect personal information from children under 13 without parental consent. If you believe a child has provided us with personal information, please contact us."
          },
          {
            title: "Contact Us",
            content: "If you have any questions about this privacy policy, please contact us at privacy@bloxquiz.gg."
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