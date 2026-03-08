export const metadata = {
    title: "Contact BloxQuiz — Get In Touch",
    description: "Contact the BloxQuiz team for questions, feedback, advertising inquiries or to report issues.",
    robots: { index: false },
  };
  
  export default function ContactPage() {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 16 }}>
          {"Contact Us 💬"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16, fontWeight: 600, marginBottom: 48, lineHeight: 1.7 }}>
          Have a question, found a bug, or want to advertise? We would love to hear from you!
        </p>
  
        {[
          { emoji: "🐛", title: "Report a Bug", desc: "Found an incorrect quiz answer or a broken feature?", email: "bugs@bloxquiz.gg" },
          { emoji: "📢", title: "Advertising", desc: "Interested in sponsoring BloxQuiz or advertising to our audience?", email: "ads@bloxquiz.gg" },
          { emoji: "🤝", title: "Partnerships", desc: "Want to collaborate or partner with BloxQuiz?", email: "partners@bloxquiz.gg" },
          { emoji: "💬", title: "General", desc: "Anything else — we are happy to chat!", email: "hello@bloxquiz.gg" },
        ].map(({ emoji, title, desc, email }) => (
          <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>{emoji}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{desc}</div>
              <a href={"mailto:" + email} style={{ color: "var(--neon-green)", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>{email}</a>
            </div>
          </div>
        ))}
      </div>
    );
  }