import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import QuizClient from "./QuizClient";

const HOW_IT_WORKS: Record<string, string> = {
  "Blox Fruits": "Blox Fruits is a Roblox RPG where players sail between seas, grind levels, and hunt for Devil Fruits that grant unique combat abilities. Progression is driven by defeating NPCs, completing quests, and unlocking new areas — from the First Sea all the way to the Third Sea.",
  "Brookhaven RP": "Brookhaven RP is a roleplay sandbox where players can own homes, drive vehicles, and act out scenarios with other players. There is no fixed objective — the game is driven entirely by player creativity and social interaction across a shared neighborhood map.",
  "Adopt Me!": "Adopt Me! is a life-simulation game where players raise and trade pets, decorate homes, and complete family-style quests. Pets are the core economy — rarity tiers range from Common to Legendary, and trading is the main endgame activity.",
  "Tower of Hell": "Tower of Hell is a competitive obby game where players race to climb a randomly generated tower of obstacles within a time limit. There are no checkpoints — fall and you start over. Sections rotate every round, so no two games are identical.",
  "Murder Mystery 2": "Murder Mystery 2 assigns players one of three roles each round: Innocent, Sheriff, or Murderer. Innocents survive, the Sheriff eliminates the Murderer, and the Murderer kills everyone before being caught. Trading knife and gun cosmetics is a major part of the long-term game.",
  "Grow a Garden": "Grow a Garden is a farming idle game where players plant seeds, water crops, and harvest produce to earn in-game currency. Rare crop mutations and seasonal seeds drive progression, and automated tools reduce the grind as you advance.",
  "Royale High": "Royale High is a fantasy roleplay school game where players attend classes, earn diamonds, and collect seasonal accessories and halos. Trading halos is the prestige economy, and event rewards are the main driver of the annual content cycle.",
  "Doors": "Doors is a horror survival game where players must escape through 100 rooms, each potentially containing deadly entities like Rush, Ambush, and Figure. Surviving requires learning each entity's audio cues, managing flashlight batteries, and knowing when to hide.",
  "Arsenal": "Arsenal is an FPS game where every kill cycles your weapon through a progression of guns, ending with the golden knife for the final kill. Fast reflexes, map knowledge, and weapon familiarity are the core skills.",
  "Anime Fighting Simulator": "Anime Fighting Simulator is a grinding RPG where players train stats, unlock anime-inspired abilities, and fight to become the strongest. Stands, quirks, and sword styles define your combat identity.",
  "Berry Avenue": "Berry Avenue is a detailed roleplay suburb where players can work jobs, own homes, and interact with a realistic neighborhood setting. It is heavily social and popular for streaming and creative roleplay scenarios.",
  "Bee Swarm Simulator": "Bee Swarm Simulator has players build a hive of bees, collect pollen from fields, and complete quests from NPC bears. Progression unlocks better bee types, larger hives, and rare amulets through a deep crafting system.",
  "Dress to Impress": "Dress to Impress is a fashion game where players compete to create outfits matching a given theme, then walk a runway judged by other players. Scoring rewards creativity, theme accuracy, and accessory choices.",
  "Anime Defenders": "Anime Defenders is a tower defense game where players place anime-inspired units on a map to defend against waves of enemies. Unit evolution, trait combinations, and stage strategy are the core mechanics.",
  "Funky Friday": "Funky Friday is a rhythm game inspired by Friday Night Funkin where players match arrow inputs to music. Timing accuracy and note pattern memorization determine your rank and leaderboard placement.",
  "Flee the Facility": "Flee the Facility is an asymmetric survival game where one player is the Beast and the rest are survivors. Survivors must hack computers to unlock exits while the Beast catches and freezes them inside pods — teammates can free frozen players by breaking the pod.",
  "Da Hood": "Da Hood is an open-world action roleplay game set in a street environment. Players can fight, rob, work, and build reputation in a PvP-heavy sandbox where combat mechanics and money management are central.",
  "Fisch": "Fisch is a fishing simulator where players cast lines across diverse aquatic environments to catch hundreds of fish species. Rare catches, rod upgrades, and location exploration drive long-term progression.",
  "Kick Off": "Kick Off is a competitive soccer game on Roblox where players score goals using skill moves, passes, and power shots. Team coordination and individual dribbling skill determine match outcomes.",
  "Natural Disaster Survival": "Natural Disaster Survival drops players onto a map and hits them with a random disaster — tornado, earthquake, tsunami, and more. Survival depends on reading the disaster type quickly and finding the right cover or high ground before time runs out.",
  "Livetopia": "Livetopia is a life roleplay game with a fully explorable city, working jobs, vehicles, and homes. Players earn money through jobs and activities, then spend it on upgrades and cosmetics.",
  "Grand Piece Online": "Grand Piece Online is a Roblox RPG inspired by the One Piece anime, where players explore islands, hunt for Devil Fruits, fight bosses, and unlock powerful races and fighting styles. Progression is tied to your level, gear, and the abilities you unlock as you sail further across the seas.",
};

const BEGINNER_MISTAKES: Record<string, string[]> = {
  "Blox Fruits": [
    "Spending in-game currency on permanent fruits early instead of saving for better options in later seas",
    "Ignoring Haki training, which is essential for dealing damage to and blocking attacks from late-game enemies",
    "Rushing through seas without leveling properly, making boss fights much harder than they need to be",
  ],
  "Brookhaven RP": [
    "Not exploring the full map — many interactive locations and secrets are hidden off the main streets",
    "Ignoring the item and vehicle menus, which have far more options than new players usually realize",
    "Playing without joining a roleplay scenario first, which makes the social experience much harder to enjoy",
  ],
  "Adopt Me!": [
    "Trading away pets without checking their rarity tier first — Common and Uncommon pets have very low trade value",
    "Spending all earned Bucks on eggs before understanding which eggs have the best legendary odds",
    "Aging pets to full grown too quickly without completing tricks, which affects their display and trading appeal",
  ],
  "Tower of Hell": [
    "Rushing instead of being patient — most falls happen from trying to move too fast through sections",
    "Not watching other players to learn section layouts before attempting them yourself",
    "Ignoring the mutators menu, which can make climbing harder or easier depending on active modifiers",
  ],
  "Murder Mystery 2": [
    "As Sheriff, shooting the wrong player and giving the Murderer an easy win by dying with the gun",
    "As Innocent, standing still or hiding in the same spot every round instead of staying mobile",
    "As Murderer, killing players too quickly in open areas where witnesses can identify you immediately",
  ],
  "Grow a Garden": [
    "Planting all slots with the same crop instead of diversifying to maximize harvest value across types",
    "Not watering crops on time — missed watering cycles significantly slow down harvest speed",
    "Selling rare mutations immediately instead of saving them for higher-value trades or crafting",
  ],
  "Royale High": [
    "Spending diamonds on basic accessories early instead of saving for seasonal limited items with higher trade value",
    "Missing class attendance, which is one of the fastest ways to earn diamonds as a new player",
    "Not understanding halo rarity tiers before attempting trades — overpaying in halos is the most common new player mistake",
  ],
  "Doors": [
    "Leaving your flashlight on constantly, draining battery before reaching dark rooms where Screech appears",
    "Exiting a closet too early during Ambush — it makes multiple passes and players often get caught on the return",
    "Running in the Library, which alerts Figure to your location — always walk slowly near Figure",
  ],
  "Arsenal": [
    "Staying still while shooting — Arsenal rewards constant movement and strafing to avoid incoming fire",
    "Not learning the knife kill requirement — reaching the golden knife stage requires one melee kill to win",
    "Ignoring map geometry — high ground and cover positions give a significant advantage in every mode",
  ],
  "Flee the Facility": [
    "Hacking computers alone without watching for the Beast — always check your surroundings while hacking",
    "Leaving frozen teammates without freeing them, which makes escape much harder for the remaining survivors",
    "Hiding in the same spot every round — the Beast learns common hiding locations quickly",
  ],
  "Bee Swarm Simulator": [
    "Ignoring NPC bear quests, which give the best early rewards and guide progression efficiently",
    "Collecting pollen from low-value fields when better fields are already unlocked",
    "Not converting pollen into honey regularly — full collection bags stop you from gathering more pollen",
  ],
  "Dress to Impress": [
    "Not reading the theme carefully before building your outfit — off-theme looks score poorly regardless of quality",
    "Using too many accessories at once, which can make an outfit look cluttered rather than stylish",
    "Ignoring the runway walk timing — entering too early or too late reduces your visibility to voters",
  ],
  "Da Hood": [
    "Starting fights without understanding the combat controls first — getting knocked early loses money",
    "Keeping large amounts of cash on hand instead of storing it — dying means losing unbanked money",
    "Ignoring the map layout early on — knowing escape routes and safe zones is essential for survival",
  ],
  "Fisch": [
    "Using the wrong rod for the location — better rods significantly improve rare catch rates",
    "Not paying attention to catch indicators — timing your reel correctly determines whether rare fish escape",
    "Fishing only in starter areas instead of exploring new locations that have exclusive rare species",
  ],
  "Anime Defenders": [
    "Placing units randomly instead of learning which positions maximize their attack range on each map",
    "Ignoring unit evolution — unevolved units fall off quickly in later stages and become liabilities",
    "Spending summon currency on banner pulls before having enough units to clear progression stages",
  ],
  "Kick Off": [
    "Trying to score every chance instead of passing — Kick Off heavily rewards team play and assists",
    "Not using skill moves — basic dribbling is easy to defend, while skill moves open up real scoring chances",
    "Ignoring stamina management — sprinting constantly drains stamina and slows your player at critical moments",
  ],
  "Natural Disaster Survival": [
    "Not identifying the disaster type fast enough — the first few seconds are critical for positioning",
    "Staying at ground level during floods and tsunamis — always seek the highest available point immediately",
    "Grouping with other players during lightning storms — spread out to avoid chain deaths",
  ],
  "Grand Piece Online": [
    "Eating the first Devil Fruit you find instead of researching which fruits suit your playstyle — some are far more useful than others",
    "Skipping island bosses early on, which drop key items and give the fastest XP for your level range",
    "Ignoring your race and fighting style choices, which have a significant impact on your combat effectiveness in later content",
  ],
};

const EDITORS = ["Riley K.", "Jamie B.", "Alex R.", "Jordan M."];

function getEditor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return EDITORS[hash % EDITORS.length];
}

function buildWhatThisTestes(title: string, game: string, difficulty: string, questionCount: number): string[] {
  const text = (title + " " + game).toLowerCase();
  const bullets: string[] = [];

  if (text.includes("beginner") || text.includes("basic") || text.includes("starter") || difficulty === "Easy") {
    bullets.push(`Core ${game} mechanics and gameplay basics`);
    bullets.push(`Essential knowledge for new ${game} players`);
  } else if (text.includes("advanced") || text.includes("expert") || text.includes("master") || difficulty === "Hard") {
    bullets.push(`Advanced ${game} mechanics and hidden details`);
    bullets.push(`Expert-level knowledge most players overlook`);
  } else {
    bullets.push(`${game} gameplay mechanics and strategies`);
    bullets.push(`Key knowledge for experienced ${game} players`);
  }

  if (text.includes("trading") || text.includes("trade") || text.includes("value")) {
    bullets.push(`Trading values and market knowledge`);
  } else if (text.includes("lore") || text.includes("story") || text.includes("history")) {
    bullets.push(`Game lore, story, and world-building details`);
  } else if (text.includes("item") || text.includes("fruit") || text.includes("weapon") || text.includes("pet")) {
    bullets.push(`Item types, rarities, and their effects`);
  } else if (text.includes("mechanic") || text.includes("combat") || text.includes("build")) {
    bullets.push(`Combat systems and build optimization`);
  } else {
    bullets.push(`Game-specific facts and trivia`);
  }

  bullets.push(`${questionCount} questions across varying difficulty levels`);
  return bullets.slice(0, 4);
}

function buildWhoShouldPlay(game: string, difficulty: string, title: string): string {
  const text = (title + " " + game).toLowerCase();
  if (difficulty === "Easy") {
    return `Perfect for players who are new to ${game} or want to test their foundational knowledge before diving into harder challenges.`;
  } else if (difficulty === "Hard") {
    return `Built for dedicated ${game} players who have spent serious time with the game and want to test the limits of their knowledge.`;
  } else {
    if (text.includes("trading")) {
      return `Ideal for active ${game} traders who want to sharpen their market knowledge and avoid bad trades.`;
    }
    return `Best suited for ${game} players who have a solid understanding of the game and want to challenge themselves beyond the basics.`;
  }
}

async function getQuiz(slug: string) {
  try {
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data && data.status !== "draft") return data;
  } catch (e) {}
  return null;
}

async function getRelatedQuizzes(currentSlug: string, game: string) {
  try {
    const { data } = await supabase
      .from("quizzes")
      .select("slug, title, game, difficulty, questions")
      .eq("game", game)
      .neq("slug", currentSlug)
      .neq("status", "draft")
      .limit(6);
    if (data) {
      return data.map((q: any) => ({
        slug: q.slug,
        title: q.title,
        game: q.game,
        difficulty: q.difficulty,
        questions: Array.isArray(q.questions) ? q.questions.length : 10,
      }));
    }
  } catch (e) {}
  return [];
}

async function getCurrentSeason() {
  try {
    const { data } = await supabase
      .from("seasons")
      .select("name, status")
      .eq("status", "active")
      .order("start_date", { ascending: false })
      .limit(1)
      .single();
    return data || null;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await getQuiz(slug);
  if (!quiz) return { title: "Quiz Not Found | BloxQuiz", description: "This quiz could not be found." };
  const cleanSlug = slug.replace(/-/g, ' ');
  return {
    title: `${quiz.title} — Free ${quiz.game} Quiz | BloxQuiz`,
    description: quiz.intro
      ? `${quiz.intro.substring(0, 150)}... Play free on BloxQuiz.gg`
      : `Test your ${quiz.game} knowledge! ${quiz.questions.length} questions on ${cleanSlug}. Can you get a perfect score? Free Roblox quiz on BloxQuiz.gg`,
    openGraph: {
      title: `${quiz.title} — Free ${quiz.game} Quiz | BloxQuiz`,
      description: quiz.intro ? quiz.intro.substring(0, 200) : `Think you know ${quiz.game}? Take this ${quiz.difficulty} quiz and find out!`,
      url: `https://www.bloxquiz.gg/quiz/${slug}`,
      siteName: "BloxQuiz",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${quiz.title} — Free ${quiz.game} Quiz | BloxQuiz`,
      description: quiz.intro ? quiz.intro.substring(0, 200) : `Think you know ${quiz.game}? Take this ${quiz.difficulty} quiz and find out!`,
    },
    alternates: { canonical: `https://www.bloxquiz.gg/quiz/${slug}` },
  };
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await getQuiz(slug);
  if (!quiz) notFound();

  const { data: edits } = await supabase
    .from("question_edits")
    .select("*")
    .eq("quiz_slug", slug);

  if (edits && edits.length > 0) {
    for (const edit of edits) {
      quiz.questions[edit.question_index] = {
        q: edit.question,
        a: edit.answers,
        correct: edit.correct,
      };
    }
  }

  const [relatedQuizzes, currentSeason] = await Promise.all([
    getRelatedQuizzes(slug, quiz.game),
    getCurrentSeason(),
  ]);

  const article = quiz.difficulty === "Easy" ? "an" : "a";
  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 10;
  const whatThisTestes = buildWhatThisTestes(quiz.title, quiz.game, quiz.difficulty, questionCount);
  const whoShouldPlay = buildWhoShouldPlay(quiz.game, quiz.difficulty, quiz.title);
  const howItWorks = HOW_IT_WORKS[quiz.game] || null;
  const beginnerMistakes = BEGINNER_MISTAKES[quiz.game] || [];
  const gameSlug = quiz.game.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const editor = getEditor(slug);

  const diffColor: Record<string, string> = {
    Easy: "#00f5a0",
    Medium: "#ffd700",
    Hard: "#ff3cac",
  };

  const reviewedDate = new Date(quiz.published_at || quiz.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const faqs = (quiz.faqs && Array.isArray(quiz.faqs) && quiz.faqs.length > 0)
    ? quiz.faqs
    : [
        { question: `How many questions are in the ${quiz.title}?`, answer: `This quiz contains ${questionCount} multiple choice questions.` },
        { question: `What difficulty is the ${quiz.title}?`, answer: `This is ${article} ${quiz.difficulty} difficulty quiz, suitable for ${quiz.difficulty === "Easy" ? "beginners just starting out" : quiz.difficulty === "Medium" ? "players with some experience" : "expert players who know the game deeply"}.` },
        { question: `Is the ${quiz.game} quiz free to play?`, answer: `Yes! All quizzes on BloxQuiz are completely free to play. Sign up to save your scores and compete on the leaderboard.` },
        { question: `How do I improve my ${quiz.game} knowledge?`, answer: `Practice by playing more ${quiz.game} quizzes on BloxQuiz, watch YouTube tutorials, and spend time playing the actual game on Roblox.` },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": `${quiz.game} Quizzes`, "item": `https://www.bloxquiz.gg/games/${gameSlug}` },
          { "@type": "ListItem", "position": 3, "name": quiz.title, "item": `https://www.bloxquiz.gg/quiz/${slug}` },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `https://www.bloxquiz.gg/quiz/${slug}`,
        "url": `https://www.bloxquiz.gg/quiz/${slug}`,
        "name": `${quiz.title} | BloxQuiz`,
        "description": quiz.intro ? quiz.intro.substring(0, 200) : `Test your ${quiz.game} knowledge with this ${quiz.difficulty} quiz. ${questionCount} questions covering ${quiz.game} gameplay, mechanics and more.`,
        "inLanguage": "en-US",
        "isPartOf": { "@id": "https://www.bloxquiz.gg" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 0" }}>
        <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 20, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
          <span>›</span>
          <a href={`/games/${gameSlug}`} style={{ color: "var(--text-dim)", textDecoration: "none" }}>{quiz.game} Quizzes</a>
          <span>›</span>
          <span style={{ color: "var(--text-muted)" }}>{quiz.title}</span>
        </nav>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 32px)", marginBottom: 16, lineHeight: 1.2, color: "var(--text)" }}>
          {quiz.title}
        </h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: `${diffColor[quiz.difficulty] || "#fff"}20`, color: diffColor[quiz.difficulty] || "#fff", border: `1px solid ${diffColor[quiz.difficulty] || "#fff"}40` }}>{quiz.difficulty}</span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>{questionCount} Questions</span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>🎮 {quiz.game}</span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>Free to Play</span>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span>✍️ Written by {editor}, BloxQuiz Editor</span>
          <span>🕐 Published {reviewedDate}</span>
          <a href="/editorial" style={{ color: "var(--text-dim)", textDecoration: "none" }}>📋 Editorial Standards</a>
        </div>

        <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 24, maxWidth: 680 }}>
          {quiz.intro || `Think you know ${quiz.game}? This ${quiz.difficulty.toLowerCase()} quiz covers ${questionCount} questions on ${quiz.game} — from core mechanics to the details most players miss. Test your knowledge, earn XP, and see how you rank against other players on BloxQuiz.`}
        </p>

        {howItWorks && (
          <div style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 10 }}>How {quiz.game} Works</h2>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{howItWorks}</p>
          </div>
        )}

        <div style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 14 }}>What This Quiz Tests</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {whatThisTestes.map((bullet, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.5 }}>
                <span style={{ color: "#00f5a0", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>✓</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {beginnerMistakes.length > 0 && (
          <div style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 14 }}>Common {quiz.game} Mistakes to Avoid</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {beginnerMistakes.map((mistake, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.5 }}>
                  <span style={{ color: "#ff3cac", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>✗</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ background: "linear-gradient(135deg, rgba(0,180,216,0.06), rgba(184,76,255,0.04))", border: "1px solid rgba(0,180,216,0.15)", borderRadius: 12, padding: "16px 20px", marginBottom: 28 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#00b4d8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Who Should Play This</span>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 600, lineHeight: 1.6 }}>{whoShouldPlay}</p>
        </div>
      </div>

      <QuizClient quiz={quiz} slug={slug} faqs={faqs} relatedQuizzes={relatedQuizzes} currentSeason={currentSeason} />
    </>
  );
}