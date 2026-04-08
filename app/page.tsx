import Hero from "./components/Hero";
import GameCategories from "./components/GameCategories";
import PopularQuizzes from "./components/PopularQuizzes";
import DailyChallenge from "./components/DailyChallenge";
import TrendingGames from "./components/TrendingGames";
import Codes from "./components/Codes";
import EmailSignup from "./components/EmailSignup";
import UsernameGeneratorBanner from "./components/UsernameGeneratorBanner";
import { supabase, supabaseAdmin } from "./lib/supabase";
import WhySignUp from "./components/WhySignUp";
import RobuxCTA from "./components/RobuxCTA";
import fs from "fs";
import path from "path";

const DAILY_CHALLENGE_THRESHOLD = 50;
const EASTER_START = new Date("2026-04-03");
const EASTER_END = new Date("2026-04-07T23:59:59");

function EasterBanner() {
  const now = new Date();
  if (now < EASTER_START || now > EASTER_END) return null;
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 8px" }}>
      <div style={{ background: "linear-gradient(135deg, rgba(255,182,193,0.12), rgba(216,191,216,0.12), rgba(152,251,152,0.12))", border: "1px solid rgba(255,182,193,0.3)", borderRadius: 16, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🥚</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#e8a0b4", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Easter Event — April 3–6</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>Hunt for hidden egg quizzes and earn bonus XP this weekend!</div>
          </div>
        </div>
        <a href="/browse" style={{ background: "linear-gradient(135deg, #e8a0b4, #b8a0d8)", color: "#fff", fontWeight: 900, fontSize: 13, padding: "8px 20px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "#fff", whiteSpace: "nowrap", flexShrink: 0 }}>🐣 Start Hunting</a>
      </div>
    </div>
  );
}

const GAME_EMOJI: Record<string, string> = {
  "blox-fruits": "⚔️",
  "dress-to-impress": "👗",
  "bee-swarm-simulator": "🐝",
  "doors": "🚪",
  "murder-mystery-2": "🔫",
  "adopt-me": "🐾",
  "brookhaven-rp": "🏠",
  "royale-high": "👑",
};

function GuidesSection({ guides }: { guides: any[] }) {
  if (guides.length === 0) return null;
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0, marginBottom: 4 }}>📖 Roblox Game Guides</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>Beginner tips, strategies, and progression paths for top Roblox games</p>
        </div>
        <a href="/guides" style={{ fontSize: 13, fontWeight: 800, color: "var(--neon-green)", textDecoration: "none", whiteSpace: "nowrap" }}>All Guides →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {guides.map((guide: any) => {
          const emoji = GAME_EMOJI[guide.game_slug] || "🎮";
          return (
            <a key={guide.slug} href={`/guides/${guide.slug}`} style={{ display: "flex", flexDirection: "column", background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 14, padding: "20px", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{guide.game_name}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "#00f5a0", border: "1px solid rgba(0,245,160,0.2)" }}>{guide.difficulty}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>
                {guide.title.replace(new RegExp(`^${guide.game_name}\\s*`, 'i'), '')}
              </h3>
              {guide.excerpt && (
                <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{guide.excerpt.substring(0, 90)}...</p>
              )}
              <span style={{ fontSize: 12, fontWeight: 800, color: "#00b4d8" }}>Read Guide →</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

async function getInitialQuizzes() {
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json")).slice(0, 8);
    return files.map(file => {
      const data = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      return { slug: data.slug, title: data.title, game: data.game, difficulty: data.difficulty, questions: data.questions.length, emoji: "🎮", thumb: "linear-gradient(135deg, rgba(0,245,160,0.15), rgba(184,76,255,0.15))" };
    });
  } catch { return []; }
}

async function getInitialDaily() {
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json"));
    const today = new Date().toISOString().split("T")[0];
    const seed = today.replace(/-/g, "");
    const index = parseInt(seed) % files.length;
    const file = files[index];
    const data = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
    return { slug: data.slug, title: data.title, game: data.game, difficulty: data.difficulty, date: today };
  } catch { return null; }
}

async function getPublishedGuides() {
  try {
    const { data } = await supabaseAdmin
      .from("game_guides")
      .select("slug, title, game_name, game_slug, difficulty, excerpt")
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(3);
    return data ?? [];
  } catch { return []; }
}

export default async function Home() {
  const [initialQuizzes, initialDaily, { count: totalPlays }, guides] = await Promise.all([
    getInitialQuizzes(),
    getInitialDaily(),
    supabase.from("plays").select("*", { count: "exact", head: true }),
    getPublishedGuides(),
  ]);

  const showDailyChallenge = (totalPlays ?? 0) >= DAILY_CHALLENGE_THRESHOLD;

  return (
    <>
      <Hero />
      <EasterBanner />
      <TrendingGames />
      {/* Game Guides — surfaced early for editorial depth signal */}
      <GuidesSection guides={guides} />
      <GameCategories />
      <UsernameGeneratorBanner />
      <PopularQuizzes initialQuizzes={initialQuizzes} />
      {/* Affiliate placement — between Popular Quizzes and Why Sign Up */}
      <div style={{ maxWidth: 1200, margin: "16px auto 0", padding: "0 24px 32px" }}>
        <RobuxCTA variant="default" />
      </div>
      <WhySignUp />
      {showDailyChallenge && <DailyChallenge initialDaily={initialDaily} />}
      <Codes />
      <EmailSignup />
    </>
  );
}