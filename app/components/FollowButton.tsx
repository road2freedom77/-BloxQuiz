"use client";
import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function FollowButton({ gameSlug, gameName }: { gameSlug: string; gameName: string }) {
  const { user, isLoaded } = useUser();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { setLoading(false); return; }

    fetch(`/api/games/follow?slug=${gameSlug}`)
      .then(r => r.json())
      .then(data => {
        setFollowing(data.following);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, isLoaded, gameSlug]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function toggleFollow() {
    if (!user) return;
    setLoading(true);

    const method = following ? "DELETE" : "POST";
    const res = await fetch("/api/games/follow", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: gameSlug }),
    });
    const data = await res.json();

    if (data.success) {
      setFollowing(data.following);
      showToast(data.following
        ? `✅ Following ${gameName} — you'll get alerts when new codes drop!`
        : `Unfollowed ${gameName}`
      );
    }
    setLoading(false);
  }

  if (!isLoaded || loading) {
    return (
      <div style={{ height: 38, width: 140, background: "var(--surface)", borderRadius: 100, opacity: 0.5 }} />
    );
  }

  // Logged out — hardcoded values to avoid Clerk CSS variable resolution issues
  if (!user) {
    return (
      <SignInButton mode="modal" fallbackRedirectUrl={`/codes/${gameSlug}`}>
        <button style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "linear-gradient(135deg, #00f5a0, #b84cff)",
          border: "none",
          borderRadius: 100,
          padding: "10px 22px",
          fontSize: 13,
          fontWeight: 800,
          color: "#0a0f1e",
          WebkitTextFillColor: "#0a0f1e",
          cursor: "pointer",
          fontFamily: "inherit",
        }}>
          🔔 Follow for Code Alerts
        </button>
      </SignInButton>
    );
  }

  // Logged in
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleFollow}
        disabled={loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: following ? "rgba(0,245,160,0.12)" : "var(--surface)",
          border: following ? "1px solid rgba(0,245,160,0.4)" : "1px solid var(--border)",
          borderRadius: 100,
          padding: "8px 18px",
          fontSize: 13,
          fontWeight: 800,
          color: following ? "var(--neon-green)" : "var(--text-muted)",
          cursor: loading ? "default" : "pointer",
          fontFamily: "var(--font-body)",
          transition: "all 0.2s",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {following ? "✅ Following" : "🔔 Follow for Code Alerts"}
      </button>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          background: "#13172A",
          border: "1px solid rgba(0,245,160,0.3)",
          borderRadius: 10,
          padding: "10px 16px",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--neon-green)",
          whiteSpace: "nowrap",
          zIndex: 50,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}