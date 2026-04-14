import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Code Alerts Work | BloxQuiz",
  description: "Follow any Roblox game on BloxQuiz and get an email the moment new codes drop. Learn how code alerts work and how to set them up for your favorite games.",
  alternates: { canonical: "https://www.bloxquiz.gg/how-it-works/code-alerts" },
};

export default function CodeAlertsGuide() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <a href="/how-it-works" style={{ color: "var(--text-dim)", textDecoration: "none" }}>How It Works</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>Code Alerts</span>
      </nav>

      <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--neon-yellow)", marginBottom: 12 }}>Feature Guide</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 5vw, 38px)", marginBottom: 16, lineHeight: 1.1 }}>
        How Code Alerts Work
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 40, maxWidth: 640 }}>
        Roblox codes expire fast. Code alerts let you follow any game on BloxQuiz and get an email the moment new codes are added — so you never miss a free reward again.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>How to set up alerts</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 16px" }}>
            Setting up code alerts takes about 30 seconds. Here's all you need to do:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { step: "1", text: "Create a free BloxQuiz account or sign in if you already have one." },
              { step: "2", text: "Go to any game's codes page — for example, bloxquiz.gg/codes/blox-fruits." },
              { step: "3", text: "Click the Follow button on that page to subscribe to code alerts for that game." },
              { step: "4", text: "That's it. The next time new codes are added for that game, you'll get an email." },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--gradient-main)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "var(--bg)", flexShrink: 0, WebkitTextFillColor: "var(--bg)" }}>{item.step}</div>
                <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>When do alerts send?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            BloxQuiz monitors code pages for changes. When a new code is confirmed and added to a game's page, an alert email is sent to everyone following that game. The email includes the new code, what reward it gives, and a direct link to the codes page so you can copy and redeem it immediately.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            Alerts only send for new codes being added — not for expired codes being removed. You won't get spammed with expiry notifications.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>How many games can I follow?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            You can follow as many games as you want. BloxQuiz covers codes for games including Blox Fruits, Adopt Me, Anime Defenders, Doors, Bee Swarm Simulator, Murder Mystery 2, and many more. Each game has its own follow button on its codes page.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Managing your followed games</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            You can see and manage which games you follow from your <a href="/profile" style={{ color: "var(--neon-green)", textDecoration: "none" }}>profile page</a>. Unfollowing a game stops future code alerts for that game immediately. Your account email address is the one alerts are sent to — you can update it from your account settings.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Do I need a paid account?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            No — code alerts are completely free for all registered users. You just need a BloxQuiz account, which is free to create.
          </p>
        </section>

      </div>

      <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/codes" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>🎁 Browse All Codes</a>
        <a href="/how-it-works/live-stats" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none" }}>How Live Stats Work →</a>
      </div>

    </div>
  );
}