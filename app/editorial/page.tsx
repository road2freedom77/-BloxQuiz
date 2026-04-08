import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Standards & Review Policy | BloxQuiz",
  description: "Learn how BloxQuiz creates, verifies, and maintains quiz content, Roblox codes, and live game statistics. Our editorial standards and data sourcing policy.",
  alternates: { canonical: "https://www.bloxquiz.gg/editorial" },
};

const LAST_UPDATED = "April 7, 2026";

export default function EditorialPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>Editorial Standards</span>
      </nav>

      {/* Header */}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 12, lineHeight: 1.1 }}>
        Editorial Standards & Review Policy
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 40 }}>
        Last updated: {LAST_UPDATED}
      </p>

      {/* Intro */}
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 40 }}>
        BloxQuiz is a Roblox trivia, codes, and live stats platform. This page explains how we create content, where our data comes from, how we verify accuracy, and what standards we hold our content to. We believe players deserve accurate, honest, and helpful information — and this page documents how we try to deliver that.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

        {/* Quiz content */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16, color: "var(--text)" }}>
            Quiz Content
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>How quizzes are created:</strong> Quiz questions are drafted using a combination of game knowledge research and AI-assisted drafting via the Anthropic Claude API. Every quiz goes through a structured review process before publication.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Review process:</strong> Before a quiz is published, each question is reviewed for factual accuracy against current game mechanics. Questions about time-sensitive content — such as item values, update-specific mechanics, or event items — are flagged and rechecked when the game receives major updates.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Corrections:</strong> Players can flag incorrect questions using the in-quiz report tool. Flagged questions are reviewed by the BloxQuiz editorial team and corrected or removed within 48 hours of confirmation.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Difficulty ratings:</strong> Quizzes are rated Easy, Medium, or Hard based on the specificity of knowledge required. Easy quizzes cover widely known information. Hard quizzes test mechanics, values, or lore that only experienced players would know.
            </p>
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border, rgba(255,255,255,0.07))" }} />

        {/* Codes */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16, color: "var(--text)" }}>
            Roblox Codes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>How codes are sourced:</strong> Codes are gathered from official game developer announcements on Twitter/X, Discord servers, YouTube videos, and in-game notices. We do not list codes from unofficial or unverified sources.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Verification:</strong> Each code is tested for validity when added. Codes are marked as active only when confirmed working. Expired codes are moved to the expired section rather than removed — this helps players avoid repeatedly trying codes that no longer work.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Update frequency:</strong> Code pages are checked and updated when new codes are announced by developers. We do not promise a fixed update schedule because code release timing is entirely controlled by game developers. Each page shows the date the codes were last verified.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Reporting stale codes:</strong> If you find a code marked active that no longer works, you can report it using the Follow button on any codes page. Reported codes are reviewed and updated promptly.
            </p>
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border, rgba(255,255,255,0.07))" }} />

        {/* Stats */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16, color: "var(--text)" }}>
            Live Game Statistics
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Data source:</strong> All player counts, visit totals, favorites, and approval ratings are fetched directly from the official Roblox API. BloxQuiz does not modify or estimate these numbers.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Update frequency:</strong> Player counts are updated hourly via automated API polling. Each stats page shows the timestamp of the most recent data fetch. Data is never more than 60 minutes old.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Historical data:</strong> BloxQuiz stores hourly snapshots and computes daily averages for all tracked games. This data is used to generate trend analysis, 7-day momentum indicators, and 30-day historical charts. Historical data is never retroactively modified.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Trend analysis:</strong> Trend labels (Rising, Stable, Cooling Off) are computed algorithmically from recent snapshot data. The written analysis on each stats page is generated dynamically from live data and reflects the current state of the game at the time of the page load.
            </p>
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border, rgba(255,255,255,0.07))" }} />

        {/* AI content policy */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16, color: "var(--text)" }}>
            Use of AI in Content Creation
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              BloxQuiz uses AI language models (specifically the Anthropic Claude API) to assist with quiz question drafting, content generation, and page copy. We believe AI-assisted content is not inherently low quality — but we hold it to the same standards as manually written content.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>What AI helps with:</strong> Initial drafts of quiz questions, tips content for codes pages, and introductory copy for game and tool pages. AI output is always reviewed before publication.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>What AI does not do:</strong> AI does not fetch live data, verify codes, or make editorial decisions about what gets published. Those decisions are made by the BloxQuiz editorial team.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              <strong style={{ color: "var(--text)" }}>Review requirement:</strong> No AI-generated content is published without human review. Quiz questions are checked for factual accuracy. Codes tips are checked against known game mechanics. Content that is clearly wrong or misleading is corrected or removed.
            </p>
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border, rgba(255,255,255,0.07))" }} />

        {/* Affiliate */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16, color: "var(--text)" }}>
            Affiliate Links & Monetization
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              BloxQuiz participates in the Amazon Associates affiliate program. Some pages contain links to Roblox Gift Cards on Amazon. If you purchase through one of these links, BloxQuiz may earn a small commission at no extra cost to you.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
              Affiliate links are clearly labeled with "Via Amazon · Affiliate link" or similar disclosure. We only link to products directly relevant to the Roblox audience (gift cards and game-related items). Affiliate relationships do not influence quiz content, code listings, or stats data.
            </p>
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border, rgba(255,255,255,0.07))" }} />

        {/* Contact */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16, color: "var(--text)" }}>
            Contact & Corrections
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            If you find factual errors, outdated information, or content that violates our standards, please contact us via the <a href="/contact" style={{ color: "var(--neon-green)", textDecoration: "none" }}>Contact page</a>. We take accuracy seriously and will respond to correction requests within 48 hours.
          </p>
        </section>

      </div>
    </div>
  );
}