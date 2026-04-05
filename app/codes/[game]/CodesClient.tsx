"use client";
import { useState } from "react";
import RobuxCTA from "../../components/RobuxCTA";
import FollowButton from "../../components/FollowButton";

const gameTips: Record<string, string> = {
  "blox-fruits": "Most Blox Fruits codes provide double experience boosts or stat resets. Players typically redeem XP boost codes while grinding levels or completing sea quests to maximize efficiency. Because codes expire quickly — often within days of release — it's best to redeem them immediately after they are announced on the developer's Twitter or Discord.",
  "adopt-me": "Adopt Me codes typically reward free Bucks, which can be spent on eggs and pets. Redeem codes as soon as they are released since they often expire during or shortly after the event they were created for. Follow the Adopt Me Twitter account for the fastest code announcements.",
  "murder-mystery-2": "Murder Mystery 2 codes typically reward free knives and cosmetic items. Codes are released during seasonal events, collaborations, and game milestones. Because MM2 codes expire fast, redeem them immediately when announced on the developer's social media.",
  "grow-a-garden": "Grow a Garden codes give players seeds, fertilizer, and tools to accelerate garden growth. Codes are typically released with major updates and seasonal events. Redeem them quickly as they often have limited use counts.",
  "brookhaven-rp": "Brookhaven RP codes give players free items and vehicles for roleplay. New codes are released during updates and special events. Follow the Brookhaven Twitter account to catch codes before they expire.",
  "tower-of-hell": "Tower of Hell codes reward modifiers and rings that change how the tower plays. Codes drop during special events and community milestones. Redeem them quickly as they often expire within days.",
  "royale-high": "Royale High codes give players free diamonds to spend on accessories and seasonal items. Codes are typically tied to seasonal events and collaborations. Follow Royale High's social media for the fastest announcements.",
  "doors": "Doors codes reward free Knobs used in the in-game shop. New codes typically drop alongside major floor and entity updates. Redeem them fast — Doors codes often expire within a week of release.",
  "arsenal": "Arsenal codes give players free skins and Bucks for cosmetic customization. Codes are released during seasonal events and collaborations. Redeem them quickly as Arsenal codes often expire without warning.",
  "anime-fighting-simulator": "Anime Fighting Simulator codes give players Chikara Shards and Yen to power up their character faster. Codes release alongside major content updates. Redeem immediately as they often expire within days.",
  "berry-avenue": "Berry Avenue codes give players free cash and items for roleplay. New codes drop during updates and events. Follow Berry Avenue's social media to catch codes before they expire.",
  "livetopia": "Livetopia codes reward coins and items for your virtual world experience. Codes are released with updates and seasonal events. Redeem them quickly as availability is often limited.",
  "natural-disaster-survival": "Natural Disaster Survival codes reward badges and special items. Codes are released during game milestones and special events. Redeem them fast as they often have a limited redemption window.",
  "anime-defenders": "Anime Defenders codes give players free gems for summons and upgrades. New codes release alongside major unit updates and milestones. Because gems are valuable for progression, redeem codes as soon as they are announced.",
  "funky-friday": "Funky Friday codes reward free points to unlock songs and cosmetics. Codes drop during collaborations and community milestones. Redeem them quickly as Funky Friday codes often expire within a few days.",
  "kick-off": "Kick Off codes give players free coins and skins for customization. Codes are released during tournaments and updates. Follow Kick Off's social channels to catch new codes as soon as they drop.",
  "fisch": "Fisch codes typically reward free coins and bait to help you progress faster. Redeem codes as soon as they are released since they often expire within days. Follow the Fisch developers on Twitter/X and join the Discord for the fastest code announcements.",
};

const gameRewards: Record<string, string[]> = {
  "blox-fruits": ["2x XP boosts for faster leveling", "Stat resets to respec your build", "In-game currency for items"],
  "adopt-me": ["Free Bucks to spend on eggs and pets", "Limited event items", "In-game cosmetics"],
  "murder-mystery-2": ["Free knives and cosmetic skins", "Seasonal limited items", "Event-exclusive accessories"],
  "grow-a-garden": ["Seeds and rare plants", "Fertilizer and growth boosters", "Gardening tools"],
  "brookhaven-rp": ["Free vehicles and props", "Exclusive roleplay items", "Seasonal cosmetics"],
  "tower-of-hell": ["Modifier tokens", "Rings for customization", "Event badges"],
  "royale-high": ["Free diamonds for the in-game shop", "Seasonal accessories", "Limited event items"],
  "doors": ["Free Knobs for the shop", "Cosmetic items", "Event-exclusive rewards"],
  "arsenal": ["Free weapon skins", "Bucks for cosmetics", "Seasonal event items"],
  "anime-fighting-simulator": ["Chikara Shards to power up", "Yen for upgrades", "Stat boosts"],
  "berry-avenue": ["Free in-game cash", "Roleplay items and props", "Seasonal cosmetics"],
  "livetopia": ["Coins for your virtual world", "Exclusive items", "Seasonal rewards"],
  "natural-disaster-survival": ["Badges and special items", "Event rewards", "Milestone cosmetics"],
  "anime-defenders": ["Free gems for summons", "Unit upgrade materials", "Event-exclusive rewards"],
  "funky-friday": ["Free points for songs and cosmetics", "Exclusive animations", "Collaboration rewards"],
  "kick-off": ["Free coins for customization", "Exclusive skins", "Tournament rewards"],
  "fisch": ["Free coins for progression", "Bait and fishing gear", "Rare item boosts"],
};

const gameSlugMap: Record<string, string> = {
  "blox-fruits": "blox-fruits",
  "adopt-me": "adopt-me",
  "murder-mystery-2": "murder-mystery-2",
  "grow-a-garden": "grow-a-garden",
  "brookhaven-rp": "brookhaven-rp",
  "tower-of-hell": "tower-of-hell",
  "royale-high": "royale-high",
  "doors": "doors",
  "arsenal": "arsenal",
  "anime-fighting-simulator": "anime-fighting-simulator",
  "berry-avenue": "berry-avenue",
  "livetopia": "livetopia",
  "natural-disaster-survival": "natural-disaster-survival",
  "anime-defenders": "anime-defenders",
  "funky-friday": "funky-friday",
  "kick-off": "kick-off",
  "fisch": "fisch",
};

function formatNumber(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

export default function CodesClient({ data, game, description, activeCodes, expiredCodes, statsData, activeCodeGames }: {
  data: any,
  game: string,
  description: string,
  activeCodes: any[],
  expiredCodes: any[],
  statsData: { currentPlayers: number | null; totalVisits: number | null } | null,
  activeCodeGames: { slug: string; game: string; icon: string }[],
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const tips = gameTips[game] || "";
  const rewards = gameRewards[game] || [];
  const quizSlug = gameSlugMap[game] || game;
  const newestCode = activeCodes[0] || null;

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumb */}
      <nav style={{ marginBottom: 20 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)", flexWrap: "wrap" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li>›</li>
          <li><a href="/codes" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Roblox Codes</a></li>
          <li>›</li>
          <li style={{ color: "var(--text)" }}>{data.game + " Codes"}</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{data.icon}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", marginBottom: 12 }}>
          {data.game + " Codes 2026 — All Active & Working"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 15, lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>
          {description}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ background: "rgba(0,245,160,0.12)", color: "var(--neon-green)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"✅ " + activeCodes.length + " Active Codes"}</span>
          <span style={{ background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"❌ " + expiredCodes.length + " Expired"}</span>
          <span style={{ background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"🔄 Updated " + data.updatedAt}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>
          {"🕐 Last updated: " + data.updatedAt + " — bookmark this page for daily code updates"}
        </div>
        <div style={{ marginTop: 12 }}>
          <FollowButton gameSlug={game} gameName={data.game} />
        </div>
      </div>

      {/* Latest code highlight */}
      {newestCode && (
        <div style={{ background: "linear-gradient(135deg, rgba(0,245,160,0.08), rgba(184,76,255,0.08))", border: "1px solid rgba(0,245,160,0.25)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "var(--neon-green)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{"🔥 Latest " + data.game + " Code"}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--neon-green)", letterSpacing: 2, marginBottom: 4 }}>{newestCode.code}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{"Reward: " + newestCode.reward}</div>
            </div>
            <button onClick={() => copyCode(newestCode.code)}
              style={{ background: copied === newestCode.code ? "rgba(0,245,160,0.2)" : "var(--gradient-main)", color: copied === newestCode.code ? "var(--neon-green)" : "var(--bg)", border: copied === newestCode.code ? "1px solid var(--neon-green)" : "none", borderRadius: 100, padding: "10px 24px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: copied === newestCode.code ? "var(--neon-green)" : "var(--bg)" }}>
              {copied === newestCode.code ? "✅ Copied!" : "📋 Copy Code"}
            </button>
          </div>
        </div>
      )}

      {/* How to redeem */}
      <div style={{ background: "rgba(0,245,160,0.05)", border: "1px solid rgba(0,245,160,0.2)", borderRadius: "var(--radius)", padding: "22px 24px", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--neon-green)", marginBottom: 12 }}>
          {"How To Redeem " + data.game + " Codes"}
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, margin: 0 }}>
          {data.howToRedeem}
        </p>
        <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginTop: 12, fontStyle: "italic" }}>
          ⚠️ Codes are case sensitive — type them exactly as shown above.
        </p>
      </div>

      {/* Active codes */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>
        {"🟢 " + data.game + " Codes 2026 — Active & Working"}
      </h2>

      {activeCodes.length === 0 ? (
        <div style={{ marginBottom: 24 }}>

          {/* No codes notice */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "18px 24px", marginBottom: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>🔍</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
                {"No active codes right now for " + data.game}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6 }}>
                {"We monitor this page continuously. When new codes drop, this list updates immediately — usually within hours of the developer announcement."}
              </div>
            </div>
          </div>

          {/* Follow CTA */}
          <div style={{ background: "linear-gradient(135deg, rgba(0,245,160,0.08), rgba(184,76,255,0.08))", border: "1px solid rgba(0,245,160,0.3)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "var(--neon-green)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              {"🔔 Get Alerted When " + data.game + " Codes Drop"}
            </div>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>
              {"Follow " + data.game + " and we'll email you the moment new codes are released — before they expire."}
            </p>
            <FollowButton gameSlug={game} gameName={data.game} />
          </div>

          {/* What rewards to expect */}
          {rewards.length > 0 && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 12, color: "var(--text)" }}>
                {"What " + data.game + " Codes Usually Give"}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rewards.map((reward, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
                    <span style={{ color: "var(--neon-green)", fontWeight: 900, flexShrink: 0 }}>✓</span>
                    {reward}
                  </div>
                ))}
              </div>
              {tips && (
                <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.6, marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  {tips}
                </p>
              )}
            </div>
          )}

          {/* While you wait */}
          <div style={{ background: "rgba(255,227,71,0.06)", border: "1px solid rgba(255,227,71,0.15)", borderRadius: "var(--radius-sm)", padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "var(--neon-yellow)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              ⏳ While You Wait
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "Codes expire fast — redeem within hours of release",
                "Codes are case sensitive — copy exactly as shown",
                "Follow the game's official Twitter/X and Discord for announcements",
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, display: "flex", gap: 8 }}>
                  <span style={{ flexShrink: 0 }}>•</span>{tip}
                </div>
              ))}
            </div>
          </div>

          {/* Cross-links to games with active codes */}
          {activeCodeGames.length > 0 && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "20px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                🎁 Games With Active Codes Right Now
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {activeCodeGames.map((g) => (
                  <a key={g.slug} href={`/codes/${g.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", whiteSpace: "nowrap" }}>
                    <span>{g.icon}</span>{g.game}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {activeCodes.map((c: any) => (
            <div key={c.code} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {c.isNew && <span style={{ fontSize: 10, fontWeight: 900, background: "var(--neon-green)", color: "var(--bg)", padding: "2px 8px", borderRadius: 100 }}>NEW</span>}
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--neon-green)", letterSpacing: 1 }}>{c.code}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{"→ " + c.reward}</span>
              </div>
              <button onClick={() => copyCode(c.code)}
                style={{ background: copied === c.code ? "rgba(0,245,160,0.2)" : "var(--gradient-main)", color: copied === c.code ? "var(--neon-green)" : "var(--bg)", border: copied === c.code ? "1px solid var(--neon-green)" : "none", borderRadius: 100, padding: "8px 20px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: copied === c.code ? "var(--neon-green)" : "var(--bg)", minWidth: 90, transition: "all 0.2s" }}>
                {copied === c.code ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Robux affiliate CTA */}
      <div style={{ marginBottom: 24 }}>
        <RobuxCTA variant="card" />
      </div>

      {/* Quiz CTA */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>{data.icon}</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 3 }}>
              {"Think You Know " + data.game + "?"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
              {"Test your knowledge with free " + data.game + " trivia quizzes!"}
            </div>
          </div>
        </div>
        <a href={"/games/" + quizSlug}
          style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 13, padding: "10px 22px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)", whiteSpace: "nowrap", flexShrink: 0 }}>
          {"🎮 Take the Quiz"}
        </a>
      </div>

      {/* Stats cross-link card */}
      {statsData && (statsData.currentPlayers || statsData.totalVisits) && (
        <a href={`/stats/${game}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "linear-gradient(135deg, #0d1f3c 0%, #0f2744 100%)", border: "1px solid rgba(0,180,216,0.25)", borderRadius: "var(--radius)", padding: "16px 24px", textDecoration: "none", marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {statsData.currentPlayers && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,180,216,0.8)", marginBottom: 2 }}>Playing Now</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#00b4d8", fontVariantNumeric: "tabular-nums" }}>{formatNumber(statsData.currentPlayers)}</div>
              </div>
            )}
            {statsData.totalVisits && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Total Visits</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums" }}>{formatNumber(statsData.totalVisits)}</div>
              </div>
            )}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#00b4d8", whiteSpace: "nowrap" }}>📊 View Live Stats →</div>
        </a>
      )}

      {/* Expiring soon notice */}
      <div style={{ background: "rgba(255,227,71,0.08)", border: "1px solid rgba(255,227,71,0.2)", borderRadius: "var(--radius-sm)", padding: "14px 20px", marginBottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--neon-yellow)", marginBottom: 2 }}>Codes Expire Without Warning</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>Bookmark this page and check back daily. We update codes as soon as new ones are released.</div>
        </div>
      </div>

      {/* Tips — only show on pages with active codes (no-code pages show tips inline above) */}
      {tips && activeCodes.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 12 }}>
            {"Tips for Using " + data.game + " Codes"}
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>{tips}</p>
        </div>
      )}

      {/* Expired codes */}
      {expiredCodes.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8, color: "var(--text-muted)" }}>
            {"🔴 Expired " + data.game + " Codes"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 12 }}>These codes no longer work but are kept for reference.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {expiredCodes.map((c: any) => (
              <div key={c.code} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, textDecoration: "line-through", color: "var(--text-dim)" }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{c.reward}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--neon-pink)" }}>Expired</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"Frequently Asked Questions"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { q: `How many active ${data.game} codes are there in 2026?`, a: `There are currently ${activeCodes.length} active ${data.game} codes listed on this page. We update regularly as new codes are released by the developers.` },
            { q: `Why isn't my ${data.game} code working?`, a: `Codes are case sensitive — type them exactly as shown. The code may also have expired or already been redeemed on your account. Check the active/expired status above.` },
            { q: `How often are new ${data.game} codes released?`, a: `New ${data.game} codes are typically released during major updates, milestones, and seasonal events. Follow the game's official Twitter/X and Discord for the fastest announcements. Bookmark this page for daily updates.` },
            { q: `Can I reuse a ${data.game} code?`, a: `No — each code can only be redeemed once per account. Attempting to use a code you've already redeemed will show an error message.` },
          ].map((faq, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{data.icon}</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>
          {"More " + data.game + " Content"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
          {"Explore all " + data.game + " quizzes, live player stats, or browse codes for every Roblox game."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={"/games/" + quizSlug} style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
            {"🎮 " + data.game + " Quizzes"}
          </a>
          <a href={"/stats/" + game} style={{ background: "linear-gradient(135deg, #00b4d8, #0077b6)", color: "#fff", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>
            {"📊 Live Stats"}
          </a>
          <a href="/codes" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>
            {"🎁 All Roblox Codes"}
          </a>
        </div>
      </div>

    </div>
  );
}