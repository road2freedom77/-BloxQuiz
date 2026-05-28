export const metadata = {
  title: "Contact BloxQuiz — Get In Touch",
  description: "Contact the BloxQuiz team for questions, feedback, advertising inquiries or to report issues.",
  robots: { index: false },
};

const EMAIL = "bloxquizgg@gmail.com";

"use client";
import { useState, useEffect } from "react";

function ObfuscatedEmail() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    setEmail(["bloxquizgg", "gmail", "com"].join("@").replace("@gmail", "@gmail"));
  }, []);
  if (!email) return <span style={{ color: "var(--neon-green)", fontWeight: 900, fontSize: 20 }}>bloxquizgg [at] gmail.com</span>;
  return (
    <a href={"mailto:" + email} style={{ color: "var(--neon-green)", fontWeight: 900, fontSize: 20, textDecoration: "none" }}>{email}</a>
  );
}

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 16 }}>
        Contact Us 💬
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 16, fontWeight: 600, marginBottom: 48, lineHeight: 1.7 }}>
        Have a question, found a bug, or want to advertise? We would love to hear from you!
      </p>

      {[
        { emoji: "🐛", title: "Report a Bug", desc: "Found an incorrect quiz answer or a broken feature?" },
        { emoji: "📢", title: "Advertising", desc: "Interested in sponsoring BloxQuiz or advertising to our audience?" },
        { emoji: "🤝", title: "Partnerships", desc: "Want to collaborate or partner with BloxQuiz?" },
        { emoji: "💬", title: "General", desc: "Anything else — we are happy to chat!" },
      ].map(({ emoji, title, desc }) => (
        <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 36, flexShrink: 0 }}>{emoji}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{title}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 600 }}>{desc}</div>
          </div>
        </div>
      ))}

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 28, textAlign: "center", marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10 }}>For all inquiries email us at</div>
        <ObfuscatedEmail />
      </div>
    </div>
  );
}