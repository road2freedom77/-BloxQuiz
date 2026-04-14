import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Live Stats Work | BloxQuiz",
  description: "BloxQuiz tracks live player counts for 90+ Roblox games, updated every hour via the Roblox API. Learn how the stats system works and what the data means.",
  alternates: { canonical: "https://www.bloxquiz.gg/how-it-works/live-stats" },
};

export default function LiveStatsGuide() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <a href="/how-it-works" style={{ color: "var(--text-dim)", textDecoration: "none" }}>How It Works</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>Live Stats</span>
      </nav>

      <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "#00b4d8", marginBottom: 12 }}>Feature Guide</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 5vw, 38px)", marginBottom: 16, lineHeight: 1.1 }}>
        How Live Stats Work
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 40, maxWidth: 640 }}>
        BloxQuiz tracks live player counts, total visits, and historical trends for over 90 Roblox games. Data is pulled directly from the Roblox API and updated every hour.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Where does the data come from?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            All player counts, visit totals, favorites counts, and approval ratings come directly from the official Roblox API. BloxQuiz does not estimate or modify these numbers — what you see is exactly what Roblox reports.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            An automated system polls the Roblox API every hour for every tracked game and stores the result as a snapshot. Each stats page shows the timestamp of the most recent snapshot so you always know how fresh the data is.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>What stats are tracked?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Concurrent players", desc: "How many players are in the game right now, updated every hour." },
              { label: "Total visits", desc: "The all-time total number of times the game has been played since it launched." },
              { label: "Favorites", desc: "How many Roblox accounts have favorited the game." },
              { label: "Approval rating", desc: "The percentage of likes vs total votes (likes + dislikes)." },
              { label: "24-hour peak", desc: "The highest concurrent player count recorded in the last 24 hours." },
              { label: "7-day trend", desc: "Whether the game is growing, stable, or declining based on recent snapshots." },
              { label: "30-day history", desc: "A chart of average and peak daily players over the past 30 days." },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "#00b4d8", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>→</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>How is trend direction calculated?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            Trend labels like Rising, Stable, and Cooling Off are calculated algorithmically from recent snapshot data. The system compares the average player count over the past 7 days against the average from the 7 days before that. If a game has significantly more players than the previous week, it's Rising. If it's significantly fewer, it's Cooling Off. Everything in between is Stable.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            Trend labels are recalculated every time the page loads so they always reflect the most current data.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>How many games are tracked?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            BloxQuiz currently tracks over 90 Roblox games including Blox Fruits, Adopt Me, Doors, Arsenal, Anime Defenders, Bee Swarm Simulator, and many more. You can browse all tracked games from the <a href="/stats" style={{ color: "#00b4d8", textDecoration: "none" }}>Stats hub page</a>.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            New games are added to tracking regularly as BloxQuiz expands its coverage of the Roblox platform.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Compare any two games</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            BloxQuiz has a head-to-head comparison tool that lets you put any two tracked games side by side. Compare player counts, visit totals, approval ratings, and 7-day trends between games like Blox Fruits vs Adopt Me or Doors vs Murder Mystery 2. You'll find compare links on every individual stats page.
          </p>
        </section>

      </div>

      <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/stats" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>📊 Browse All Stats</a>
        <a href="/how-it-works/leaderboard" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none" }}>How the Leaderboard Works →</a>
      </div>

    </div>
  );
}