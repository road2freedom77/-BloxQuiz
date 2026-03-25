"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../lib/supabase";

const diffColors: Record<string, { color: string, bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

const difficulties = ["All", "Easy", "Medium", "Hard"];
const PAGE_SIZE = 12;

const gameHubs = [
  { name: "Blox Fruits", slug: "blox-fruits", emoji: "⚔️" },
  { name: "Brookhaven RP", slug: "brookhaven-rp", emoji: "🏠" },
  { name: "Adopt Me!", slug: "adopt-me", emoji: "🐾" },
  { name: "Tower of Hell", slug: "tower-of-hell", emoji: "🗼" },
  { name: "Murder Mystery 2", slug: "murder-mystery-2", emoji: "🔫" },
  { name: "Grow a Garden", slug: "grow-a-garden", emoji: "🌱" },
  { name: "Royale High", slug: "royale-high", emoji: "👑" },
  { name: "Doors", slug: "doors", emoji: "🚪" },
  { name: "Arsenal", slug: "arsenal", emoji: "🎯" },
  { name: "Anime Fighting Simulator", slug: "anime-fighting-simulator", emoji: "🥊" },
  { name: "Berry Avenue", slug: "berry-avenue", emoji: "🍓" },
  { name: "Livetopia", slug: "livetopia", emoji: "🏖️" },
  { name: "Natural Disaster Survival", slug: "natural-disaster-survival", emoji: "🌪️" },
  { name: "Anime Defenders", slug: "anime-defenders", emoji: "🐉" },
  { name: "Funky Friday", slug: "funky-friday", emoji: "🎵" },
  { name: "Kick Off", slug: "kick-off", emoji: "⚽" },
  { name: "Bee Swarm Simulator", slug: "bee-swarm-simulator", emoji: "🐝" },
  { name: "Dress to Impress", slug: "dress-to-impress", emoji: "👗" },
  { name: "Fisch", slug: "fisch", emoji: "🎣" },
  { name: "RIVALS", slug: "rivals", emoji: "⚔️" },
  { name: "The Strongest Battlegrounds", slug: "the-strongest-battlegrounds", emoji: "💥" },
  { name: "Jujutsu Shenanigans", slug: "jujutsu-shenanigans", emoji: "🥋" },
  { name: "Blade Ball", slug: "blade-ball", emoji: "🔵" },
  { name: "Attack on Titan Revolution", slug: "attack-on-titan-revolution", emoji: "⚡" },
  { name: "Jujutsu Infinite", slug: "jujutsu-infinite", emoji: "🌀" },
  { name: "Grand Piece Online", slug: "grand-piece-online", emoji: "🏴‍☠️" },
  { name: "Anime Battlegrounds X", slug: "anime-battlegrounds-x", emoji: "🌟" },
  { name: "Fruit Battlegrounds", slug: "fruit-battlegrounds", emoji: "🍑" },
  { name: "Project Slayers", slug: "project-slayers", emoji: "🗡️" },
  { name: "Demon Slayer RPG 2", slug: "demon-slayer-rpg-2", emoji: "🔥" },
  { name: "King Legacy", slug: "king-legacy", emoji: "👑" },
  { name: "Untitled Boxing Game", slug: "untitled-boxing-game", emoji: "🥊" },
  { name: "Shindo Life", slug: "shindo-life", emoji: "🍃" },
  { name: "Ro-Ghoul", slug: "ro-ghoul", emoji: "👁️" },
  { name: "Type Soul", slug: "type-soul", emoji: "⚔️" },
  { name: "Deepwoken", slug: "deepwoken", emoji: "🌊" },
  { name: "Evade", slug: "evade", emoji: "👻" },
  { name: "Dandy's World", slug: "dandys-world", emoji: "🎪" },
  { name: "3008", slug: "3008", emoji: "🏬" },
  { name: "Flee the Facility", slug: "flee-the-facility", emoji: "🏃" },
  { name: "Forsaken", slug: "forsaken", emoji: "💀" },
  { name: "Piggy", slug: "piggy", emoji: "🐷" },
  { name: "Survive the Killer", slug: "survive-the-killer", emoji: "🔪" },
  { name: "Camping", slug: "camping", emoji: "⛺" },
  { name: "Murder Party", slug: "murder-party", emoji: "🎭" },
  { name: "99 Nights in the Forest", slug: "99-nights-in-the-forest", emoji: "🌲" },
  { name: "Sol's RNG", slug: "sols-rng", emoji: "🎲" },
  { name: "Pet Simulator X", slug: "pet-simulator-x", emoji: "🐾" },
  { name: "Pet Simulator 99", slug: "pet-simulator-99", emoji: "🐶" },
  { name: "Dragon Adventures", slug: "dragon-adventures", emoji: "🐉" },
  { name: "Ghost Simulator", slug: "ghost-simulator", emoji: "👻" },
  { name: "Muscle Legends", slug: "muscle-legends", emoji: "💪" },
  { name: "Strongman Simulator", slug: "strongman-simulator", emoji: "🏋️" },
  { name: "Ninja Legends", slug: "ninja-legends", emoji: "🥷" },
  { name: "Anime Impact Simulator", slug: "anime-impact-simulator", emoji: "⭐" },
  { name: "Anime Dimensions Simulator", slug: "anime-dimensions-simulator", emoji: "✨" },
  { name: "Fish It!", slug: "fish-it", emoji: "🎣" },
  { name: "Zombie Attack", slug: "zombie-attack", emoji: "🧟" },
  { name: "My Supermarket", slug: "my-supermarket", emoji: "🛒" },
  { name: "Clicker Simulator X", slug: "clicker-simulator-x", emoji: "👆" },
  { name: "Arm Wrestle Simulator", slug: "arm-wrestle-simulator", emoji: "💪" },
  { name: "Anime Story", slug: "anime-story", emoji: "📖" },
  { name: "Welcome to Bloxburg", slug: "welcome-to-bloxburg", emoji: "🏡" },
  { name: "MeepCity", slug: "meep-city", emoji: "🌆" },
  { name: "Da Hood", slug: "da-hood", emoji: "🏙️" },
  { name: "Southwest Florida", slug: "southwest-florida", emoji: "🌴" },
  { name: "Prison Life", slug: "prison-life", emoji: "🔒" },
  { name: "Creatures of Sonaria", slug: "creatures-of-sonaria", emoji: "🦕" },
  { name: "PLS DONATE", slug: "pls-donate", emoji: "💸" },
  { name: "My Restaurant", slug: "my-restaurant", emoji: "🍽️" },
  { name: "Starving Artists", slug: "starving-artists", emoji: "🎨" },
  { name: "Squid Game", slug: "squid-game", emoji: "🦑" },
  { name: "Speed Run 4", slug: "speed-run-4", emoji: "🏃" },
  { name: "Obby But You're on a Bike", slug: "obby-but-youre-on-a-bike", emoji: "🚲" },
  { name: "BARRY'S PRISON RUN!", slug: "barrys-prison-run", emoji: "🏃" },
  { name: "Tower Defense Simulator", slug: "tower-defense-simulator", emoji: "🗼" },
  { name: "Anime Vanguards", slug: "anime-vanguards", emoji: "🛡️" },
  { name: "Toilet Tower Defense", slug: "toilet-tower-defense", emoji: "🚽" },
  { name: "All Star Tower Defense", slug: "all-star-tower-defense", emoji: "⭐" },
  { name: "Blue Lock: Rivals", slug: "blue-lock-rivals", emoji: "⚽" },
  { name: "Driving Empire", slug: "driving-empire", emoji: "🚗" },
  { name: "Super Striker League", slug: "super-striker-league", emoji: "⚽" },
  { name: "Hypershot", slug: "hypershot", emoji: "🎯" },
  { name: "Build A Boat For Treasure", slug: "build-a-boat-for-treasure", emoji: "⛵" },
  { name: "Work at a Pizza Place", slug: "work-at-a-pizza-place", emoji: "🍕" },
  { name: "Lumber Tycoon 2", slug: "lumber-tycoon-2", emoji: "🪵" },
  { name: "Islands", slug: "islands", emoji: "🏝️" },
  { name: "Break In", slug: "break-in", emoji: "🚨" },
  { name: "Super Golf", slug: "super-golf", emoji: "⛳" },
  { name: "Kaiju Universe", slug: "kaiju-universe", emoji: "🦖" },
  { name: "Car Dealership Tycoon", slug: "car-dealership-tycoon", emoji: "🚘" },
  { name: "Heroes World", slug: "heroes-world", emoji: "🦸" },
  { name: "Slap Battles", slug: "slap-battles", emoji: "👋" },
  { name: "BedWars", slug: "bedwars", emoji: "🛏️" },
  { name: "Ragdoll Universe", slug: "ragdoll-universe", emoji: "🪆" },
  { name: "House Tycoon", slug: "house-tycoon", emoji: "🏠" },
];

export default function QuizzesPage() {
  const { user } = useUser();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [gamesList, setGamesList] = useState<string[]>(["All"]);
  const [playedSlugs, setPlayedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    if (game) setGameFilter(game);
  }, []);

  useEffect(() => {
    fetch("/api/quizzes?limit=500")
      .then(r => r.json())
      .then(data => {
        const qs = data.quizzes || [];
        setQuizzes(qs);
        const distinct = ["All", ...Array.from(new Set(qs.map((q: any) => q.game))).sort() as string[]];
        setGamesList(distinct);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("scores")
      .select("quiz_slug")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setPlayedSlugs(new Set(data.map(r => r.quiz_slug)));
      });
  }, [user?.id]);

  useEffect(() => { setPage(1); }, [gameFilter, diffFilter, search]);

  const filtered = quizzes.filter(q => {
    if (gameFilter !== "All" && q.game !== gameFilter) return false;
    if (diffFilter !== "All" && q.difficulty !== diffFilter) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const distinctGameCount = new Set(quizzes.map(q => q.game)).size;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function Pagination() {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => { setPage(p => Math.max(1, p - 1)); scrollToTop(); }} disabled={page === 1}
          style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: page === 1 ? "default" : "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: "var(--surface)", color: page === 1 ? "var(--text-dim)" : "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}>{"← Prev"}</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => { setPage(p); scrollToTop(); }}
            style={{ padding: "8px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: page === p ? "var(--gradient-main)" : "var(--surface)", color: page === p ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: page === p ? "var(--bg)" : "var(--text-muted)", minWidth: 40 }}>{p}</button>
        ))}
        <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }} disabled={page === totalPages}
          style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: page === totalPages ? "default" : "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: "var(--surface)", color: page === totalPages ? "var(--text-dim)" : "var(--text-muted)", opacity: page === totalPages ? 0.4 : 1 }}>{"Next →"}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, marginBottom: 8 }}>{"🎮 All Quizzes"}</h1>
      <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 32 }}>
        {loading ? "Loading..." : `${quizzes.length} quizzes across ${distinctGameCount} Roblox games`}
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input type="text" placeholder="🔍 Search quizzes..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", minWidth: 240 }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {gamesList.map(g => (
          <button key={g} onClick={() => setGameFilter(g)}
            style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: gameFilter === g ? "var(--gradient-main)" : "var(--surface)", color: gameFilter === g ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: gameFilter === g ? "var(--bg)" : "var(--text-muted)" }}>{g}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {difficulties.map(d => (
          <button key={d} onClick={() => setDiffFilter(d)}
            style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: diffFilter === d ? "var(--neon-pink)" : "var(--surface)", color: diffFilter === d ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: diffFilter === d ? "var(--bg)" : "var(--text-muted)" }}>{d}</button>
        ))}
      </div>

      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
            {"Showing " + ((page - 1) * PAGE_SIZE + 1) + "–" + Math.min(page * PAGE_SIZE, filtered.length) + " of " + filtered.length + " quizzes"}
          </div>
          <Pagination />
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontWeight: 700, padding: 40 }}>Loading quizzes...</div>
      ) : paginated.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontWeight: 700, padding: 40 }}>No quizzes found!</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {paginated.map((quiz) => {
            const diff = diffColors[quiz.difficulty] || diffColors.Medium;
            const played = playedSlugs.has(quiz.slug);
            return (
              <a href={"/quiz/" + quiz.slug} key={quiz.slug} style={{ background: "var(--bg-card)", border: "1px solid " + (played ? "rgba(0,245,160,0.25)" : "var(--border)"), borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer", textDecoration: "none", display: "block", position: "relative" }}>
                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, background: quiz.thumb, position: "relative" }}>
                  {quiz.emoji}
                  {played ? (
                    <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,245,160,0.15)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 900, color: "var(--neon-green)", border: "1px solid rgba(0,245,160,0.3)" }}>✅ PLAYED</span>
                  ) : (
                    <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 900, color: "var(--neon-green)" }}>▶ PLAY</span>
                  )}
                </div>
                <div style={{ padding: "14px 16px 18px" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)" }}>{quiz.game}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: diff.bg, color: diff.color }}>{quiz.difficulty}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "var(--surface)", color: "var(--text-muted)" }}>{quiz.questions} Q's</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{quiz.title}</h3>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <Pagination />
        </div>
      )}

      {/* Game Hubs section */}
      <div style={{ marginTop: 64, borderTop: "1px solid var(--border)", paddingTop: 40 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 8 }}>🎮 Browse by Game</h2>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 24 }}>
          Each game hub has all quizzes, free codes, and live player stats in one place.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {gameHubs.map(({ name, slug, emoji }) => (
            <a key={slug} href={"/games/" + slug}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", textDecoration: "none" }}>
              <span style={{ fontSize: 22 }}>{emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{name}</div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>View Hub →</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}