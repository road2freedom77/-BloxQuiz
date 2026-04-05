"use client";
import { useState, useMemo } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import type { GameEntry } from "./page";

const VIBES = [
  {
    id: "chill",
    label: "Chill & Relaxing",
    emoji: "🌿",
    description: "Low stakes, cozy, hang out",
    genres: ["simulator", "roleplay", "fashion"],
    why: "These games let you play at your own pace — no pressure, no timers. Perfect for winding down or hanging out with friends.",
  },
  {
    id: "action",
    label: "Action & Combat",
    emoji: "⚔️",
    description: "Fight, grind, level up",
    genres: ["rpg", "shooter", "sports"],
    why: "Fast-paced games with real stakes — PvP, grinding systems, and builds that reward time invested. High player counts mean active servers right now.",
  },
  {
    id: "horror",
    label: "Horror & Suspense",
    emoji: "😱",
    description: "Scary, tense, survival",
    genres: ["horror", "mystery", "survival"],
    why: "Tension, jump scares, and unpredictable events. Best played with friends — or alone if you're brave enough.",
  },
  {
    id: "competitive",
    label: "Competitive",
    emoji: "🏆",
    description: "Win, rank up, outplay",
    genres: ["tower-defense", "shooter", "sports", "obby"],
    why: "Games where skill actually matters. High player counts mean you'll find a match fast and always have someone to beat.",
  },
  {
    id: "social",
    label: "Creative & Social",
    emoji: "🎨",
    description: "Roleplay, express yourself",
    genres: ["roleplay", "rhythm", "fashion"],
    why: "Less about winning, more about vibing. Customize, create, and connect with other players in open-ended worlds.",
  },
  {
    id: "quick",
    label: "Quick Session",
    emoji: "⚡",
    description: "In and out, fast rounds",
    genres: ["obby", "mystery", "shooter"],
    why: "Short rounds, instant action. Jump in, play a few rounds, and leave — no long-term commitment required.",
  },
  {
    id: "deep",
    label: "Deep Progression",
    emoji: "🕹️",
    description: "Long grind, big rewards",
    genres: ["rpg", "simulator", "tower-defense"],
    why: "Games with real depth — skill trees, upgrades, and progression systems that keep you coming back for more. Best for longer sessions.",
  },
  {
    id: "trending",
    label: "What's Trending",
    emoji: "🔥",
    description: "Most popular right now",
    genres: ["rpg", "roleplay", "simulator", "shooter", "horror", "survival", "mystery", "obby", "tower-defense", "sports", "rhythm", "fashion"],
    why: "The games with the most momentum right now — Rising trend, high player counts, active communities. Jump in while they're hot.",
    trendingOnly: true,
  },
  {
    id: "robux",
    label: "Need More Robux?",
    emoji: "💎",
    description: "Gift cards, top up, deals",
    genres: [],
    why: "",
  },
];

function formatNumber(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function trendColor(label: string | null): string {
  if (label === "Rising") return "#00f5a0";
  if (label === "Cooling Off") return "#ff6b6b";
  return "#a0aec0";
}

function FollowCTA({ gameSlug, gameName }: { gameSlug: string; gameName: string }) {
  const { user, isLoaded } = useUser();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (!user || loading) return;
    setLoading(true);
    const res = await fetch("/api/games/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: gameSlug }),
    });
    const data = await res.json();
    if (data.success) setFollowing(true);
    setLoading(false);
  }

  if (!isLoaded) return null;

  if (!user) {
    return (
      <SignInButton mode="modal" fallbackRedirectUrl="/what-roblox-game-should-i-play">
        <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          🔔 Follow
        </button>
      </SignInButton>
    );
  }

  if (following) {
    return <span style={{ fontSize: 11, fontWeight: 700, color: "#00f5a0", padding: "6px 0" }}>✅ Following</span>;
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      style={{ background: "none", border: "1px solid rgba(0,245,160,0.3)", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "#00f5a0", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", opacity: loading ? 0.6 : 1 }}
    >
      🔔 Follow
    </button>
  );
}

function RobuxPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
      {/* Main affiliate card */}
      <a
        href="https://www.amazon.com/s?k=roblox+gift+card&tag=bloxquiz-20"
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{ textDecoration: "none" }}
      >
        <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", border: "1px solid rgba(255,215,0,0.25)", borderLeft: "3px solid #ffd700", borderRadius: 14, padding: "24px 28px", cursor: "pointer" }}>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ffd700", marginBottom: 10 }}>
            💎 Get Robux — Amazon Gift Cards
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Roblox Gift Cards from $10</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 16 }}>
            Top up your Robux balance instantly. Buy direct on Amazon — works for game passes, avatar items, and in-game purchases across every Roblox game.
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ffd700", color: "#0a0a14", fontWeight: 900, fontSize: 14, padding: "10px 24px", borderRadius: 100 }}>
            🛒 Shop on Amazon →
          </div>
        </div>
      </a>

      {/* Why Robux context */}
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 10 }}>What can you do with Robux?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "Buy game passes for Blox Fruits, Brookhaven, Adopt Me, and more",
            "Unlock exclusive avatar items and accessories",
            "Access VIP servers and premium game features",
            "Support your favorite Roblox game developers",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              <span style={{ color: "#ffd700", flexShrink: 0 }}>✓</span>{item}
            </div>
          ))}
        </div>
      </div>

      {/* Cross-link back to games */}
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Know what game you want to spend it on?</div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/stats/most-played" style={{ fontSize: 12, fontWeight: 700, color: "#00b4d8", textDecoration: "none" }}>Most Played →</a>
          <a href="/stats/trending" style={{ fontSize: 12, fontWeight: 700, color: "#00f5a0", textDecoration: "none" }}>Trending →</a>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", margin: 0 }}>
        BloxQuiz may earn a commission from qualifying Amazon purchases.
      </p>
    </div>
  );
}

export default function GameFinderClient({ games }: { games: GameEntry[] }) {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const selectedVibeData = VIBES.find((v) => v.id === selectedVibe) ?? null;
  const isRobuxVibe = selectedVibe === "robux";

  const results = useMemo(() => {
    if (!selectedVibe || !selectedVibeData || isRobuxVibe) return [];
    const forceTrending = (selectedVibeData as any).trendingOnly === true;
    return games
      .filter((g) => {
        const genreMatch = selectedVibeData.genres.includes(g.genre);
        const trendMatch = (trendingOnly || forceTrending) ? g.trend_label === "Rising" : true;
        return genreMatch && trendMatch;
      })
      .slice(0, 3);
  }, [selectedVibe, selectedVibeData, trendingOnly, isRobuxVibe, games]);

  function handleVibe(vibeId: string) {
    setSelectedVibe(vibeId);
    setHasSearched(true);
    setTrendingOnly(false);
  }

  function reset() {
    setSelectedVibe(null);
    setHasSearched(false);
    setTrendingOnly(false);
  }

  const topGameNames = games.slice(0, 8).map((g) => g.name).join(", ");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #0f0f23 0%, #0a0a14 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 0 40px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.1 }}>
            What Roblox Game Should I Play Right Now?
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "0 auto", maxWidth: 520, lineHeight: 1.6 }}>
            Pick your vibe and get 3 personalized picks with live player counts. Updated hourly.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Vibe selector — 3 columns, 3 rows */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 16, textAlign: "center" }}>
            What's your vibe right now?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {VIBES.map((vibe) => {
              const isSelected = selectedVibe === vibe.id;
              const isRobux = vibe.id === "robux";
              return (
                <button
                  key={vibe.id}
                  onClick={() => handleVibe(vibe.id)}
                  style={{
                    background: isRobux
                      ? isSelected
                        ? "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.15))"
                        : "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,165,0,0.04))"
                      : isSelected
                        ? "linear-gradient(135deg, rgba(0,245,160,0.15), rgba(184,76,255,0.15))"
                        : "#111827",
                    border: isRobux
                      ? isSelected ? "1px solid rgba(255,215,0,0.6)" : "1px solid rgba(255,215,0,0.2)"
                      : isSelected ? "1px solid rgba(0,245,160,0.5)" : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14,
                    padding: "18px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{vibe.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isRobux ? (isSelected ? "#ffd700" : "rgba(255,215,0,0.8)") : isSelected ? "#00f5a0" : "#fff", marginBottom: 4 }}>
                    {vibe.label}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{vibe.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trending filter — only for non-robux, non-trending vibes */}
        {selectedVibe && !isRobuxVibe && selectedVibe !== "trending" && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <button
              onClick={() => setTrendingOnly(!trendingOnly)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: trendingOnly ? "rgba(0,245,160,0.12)" : "#111827",
                border: trendingOnly ? "1px solid rgba(0,245,160,0.4)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 100,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 700,
                color: trendingOnly ? "#00f5a0" : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              🔥 {trendingOnly ? "Showing trending only" : "Show trending games only"}
            </button>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div>
            {/* Robux vibe */}
            {isRobuxVibe && <RobuxPanel />}

            {/* Game results */}
            {!isRobuxVibe && (
              <>
                {results.length === 0 ? (
                  <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 14, padding: "32px 0" }}>
                    No games matched — try removing the trending filter or picking a different vibe.
                  </div>
                ) : (
                  <>
                    {/* Result header */}
                    <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "18px 24px", marginBottom: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#00b4d8", marginBottom: 6 }}>
                        🎮 Based on your vibe: {selectedVibeData?.label}
                      </div>
                      <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                        {selectedVibeData?.why}
                      </p>
                    </div>

                    {/* Game cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                      {results.map((game, i) => (
                        <div
                          key={game.slug}
                          style={{
                            background: i === 0 ? "linear-gradient(135deg, #0f1629 0%, #111827 100%)" : "#111827",
                            border: i === 0 ? "1px solid rgba(0,180,216,0.3)" : "1px solid rgba(255,255,255,0.07)",
                            borderLeft: i === 0 ? "3px solid #00b4d8" : undefined,
                            borderRadius: 14,
                            padding: "18px 20px",
                          }}
                        >
                          {/* Top row */}
                          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
                            <div style={{ fontSize: 20, minWidth: 28, textAlign: "center" }}>
                              {i === 0 ? "🏆" : `#${i + 1}`}
                            </div>
                            {game.thumbnail_url && (
                              <img src={game.thumbnail_url} alt={game.name} width={48} height={48} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1, minWidth: 140 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                                <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
                                  {game.emoji && <span style={{ marginRight: 4 }}>{game.emoji}</span>}
                                  {game.name}
                                </span>
                                {game.trend_label && (
                                  <span style={{ fontSize: 10, fontWeight: 700, color: trendColor(game.trend_label), background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: 100 }}>
                                    {game.trend_label === "Rising" ? "↑" : "↓"} {game.trend_label}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: 12, color: "#00b4d8", fontWeight: 700 }}>
                                {formatNumber(game.current_players)} playing now
                                <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 8, fontWeight: 600, textTransform: "capitalize" }}>{game.genre}</span>
                              </div>
                            </div>
                            <FollowCTA gameSlug={game.slug} gameName={game.name} />
                          </div>

                          {/* CTAs */}
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <a href={`/games/${game.slug}`} style={{ background: "linear-gradient(135deg, #00b4d8, #0077b6)", color: "#fff", fontWeight: 800, fontSize: 12, padding: "8px 16px", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" }}>
                              🎮 Take a Quiz
                            </a>
                            <a href={`/stats/${game.slug}`} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" }}>
                              📊 Live Stats
                            </a>
                            <a href={`/codes/${game.slug}`} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" }}>
                              🎁 Codes
                            </a>
                            <a href={`/stats/${game.slug}/history`} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" }}>
                              📈 History
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Robux affiliate — users thinking about games = conversion moment */}
                    <a
                      href="https://www.amazon.com/s?k=roblox+gift+card&tag=bloxquiz-20"
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,165,0,0.04))", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", marginBottom: 20, flexWrap: "wrap" }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#ffd700", marginBottom: 2 }}>💎 Want Robux for these games?</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>Roblox Gift Cards on Amazon — from $10</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#ffd700", whiteSpace: "nowrap" }}>Shop Now →</div>
                    </a>

                    {/* Follow CTA banner */}
                    <div style={{ background: "linear-gradient(135deg, rgba(0,245,160,0.06), rgba(184,76,255,0.06))", border: "1px solid rgba(0,245,160,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#00f5a0", marginBottom: 3 }}>🔔 Follow these games for code alerts</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Get notified when new codes drop for any game you follow.</div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Try again */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <button
                onClick={reset}
                style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "10px 24px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}
              >
                ↩ Try a different vibe
              </button>
            </div>
          </div>
        )}

        {/* SEO keyword block */}
        <div style={{ marginTop: 48, background: "#111827", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Popular choices right now</div>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 600 }}>
            {topGameNames} — and more. All recommendations are based on live player counts updated hourly via the Roblox API.
          </p>
        </div>

        {/* Bottom cross-links */}
        <div style={{ marginTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", marginBottom: 16, textAlign: "center" }}>
            Explore More
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {[
              { href: "/stats/most-played", label: "Most Played Games", emoji: "🎮" },
              { href: "/stats/trending", label: "Trending Right Now", emoji: "📈" },
              { href: "/codes", label: "Active Roblox Codes", emoji: "🎁" },
              { href: "/browse", label: "All Quizzes", emoji: "🧠" },
              { href: "/roblox-username-ideas", label: "Username Ideas", emoji: "✏️" },
              { href: "/stats", label: "Live Game Stats", emoji: "📊" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13 }}
              >
                <span>{link.emoji}</span><span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}