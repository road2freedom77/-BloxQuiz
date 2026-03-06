"use client";
import { useState } from "react";

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };
const RANK_LABELS: Record<number, string> = { 1: "1st Place 👑", 2: "2nd Place 🥈", 3: "3rd Place 🥉" };

export default function ClaimClient({
  username,
  prizeData,
  existingClaim,
  prizeAmount,
}: {
  username: string,
  prizeData: any | null,
  existingClaim: any | null,
  prizeAmount: string | null,
}) {
  const [robloxUsername, setRobloxUsername] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!robloxUsername.trim()) { setError("Roblox username is required."); return; }
    if (!email.trim() || !email.includes("@")) { setError("A valid email is required."); return; }
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/rewards/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        robloxUsername: robloxUsername.trim(),
        email: email.trim(),
        discord: discord.trim(),
        seasonId: prizeData?.season_id,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (data.success) {
      setSubmitted(true);
    } else {
      setError(data.error || "Something went wrong. Please try again.");
    }
  }

  // No prize
  if (!prizeData) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px", textAlign: "center", zIndex: 1, position: "relative" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>No Prize to Claim</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          You don't currently have a prize waiting. Finish in the top 3 of a season with 10+ quizzes completed to win!
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/leaderboard" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
            🏆 View Leaderboard
          </a>
          <a href="/browse" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", border: "1px solid var(--border)" }}>
            🎮 Play Quizzes
          </a>
        </div>
      </div>
    );
  }

  // Already claimed
  if (existingClaim || submitted) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px", textAlign: "center", zIndex: 1, position: "relative" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>Prize Claimed!</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
          Your claim has been submitted successfully. We'll send your gift card to the email you provided within 7 days.
        </p>
        <p style={{ color: "var(--text-dim)", fontWeight: 600, fontSize: 13, marginBottom: 24 }}>
          {"Submitted: " + (existingClaim ? new Date(existingClaim.submitted_at).toLocaleDateString() : "Just now")}
        </p>
        <a href={"/profile/" + username} style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)", display: "inline-block" }}>
          Back to Profile
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Prize banner */}
      <div style={{ background: "linear-gradient(135deg, rgba(255,227,71,0.12), rgba(184,76,255,0.08))", border: "2px solid rgba(255,227,71,0.35)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 28, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 4 }}>
          {"Congrats, " + username + "!"}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--neon-yellow)", marginBottom: 4 }}>
          {RANK_LABELS[prizeData.rank] + " — Season 1"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "var(--neon-green)", fontFamily: "var(--font-display)" }}>
          {prizeAmount + " Roblox Gift Card"}
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 6 }}>Claim Your Prize</div>
      <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        Fill in your details below. Your gift card will be sent to your email within 7 days.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Roblox username */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>
            Roblox Username <span style={{ color: "var(--neon-pink)" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Your Roblox username"
            value={robloxUsername}
            onChange={e => setRobloxUsername(e.target.value)}
            style={{ width: "100%", padding: "12px 18px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 12, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 6 }}>
            We'll send the gift card to this Roblox account.
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>
            Email Address <span style={{ color: "var(--neon-pink)" }}>*</span>
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px 18px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 12, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 6 }}>
            Amazon digital gift card will be sent here.
          </div>
        </div>

        {/* Discord (optional) */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>
            Discord Username <span style={{ color: "var(--text-dim)", fontWeight: 600, textTransform: "none", fontSize: 11 }}>(optional)</span>
          </label>
          <input
            type="text"
            placeholder="username#0000"
            value={discord}
            onChange={e => setDiscord(e.target.value)}
            style={{ width: "100%", padding: "12px 18px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 12, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 6 }}>
            So we can feature you as a winner in our community!
          </div>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(255,60,172,0.1)", border: "1px solid rgba(255,60,172,0.3)", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "var(--neon-pink)" }}>
            {"⚠️ " + error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ padding: "14px 32px", borderRadius: 100, border: "none", background: submitting ? "var(--surface)" : "var(--gradient-main)", color: submitting ? "var(--text-muted)" : "var(--bg)", fontWeight: 900, fontSize: 15, cursor: submitting ? "default" : "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: submitting ? "var(--text-muted)" : "var(--bg)", marginTop: 8 }}>
          {submitting ? "⏳ Submitting..." : "🎁 Submit Claim"}
        </button>

        <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.6, textAlign: "center" }}>
          By submitting you agree to our <a href="/rules" style={{ color: "#B84CFF", textDecoration: "none" }}>contest rules</a>. Claims expire 14 days after season end.
        </p>
      </div>
    </div>
  );
}