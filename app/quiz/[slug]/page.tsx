import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import QuizClient from "./QuizClient";

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
      return data.map(q => ({
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await getQuiz(slug);

  if (!quiz) return {
    title: "Quiz Not Found | BloxQuiz",
    description: "This quiz could not be found."
  };

  const cleanSlug = slug.replace(/-/g, ' ');

  return {
    title: `${quiz.title} — Free ${quiz.game} Quiz | BloxQuiz`,
    description: quiz.intro
      ? `${quiz.intro.substring(0, 150)}... Play free on BloxQuiz.gg`
      : `Test your ${quiz.game} knowledge! ${quiz.questions.length} questions on ${cleanSlug}. Can you get a perfect score? Free Roblox quiz on BloxQuiz.gg`,
    openGraph: {
      title: `${quiz.title} — Free ${quiz.game} Quiz | BloxQuiz`,
      description: quiz.intro
        ? quiz.intro.substring(0, 200)
        : `Think you know ${quiz.game}? Take this ${quiz.difficulty} quiz and find out!`,
      url: `https://www.bloxquiz.gg/quiz/${slug}`,
      siteName: "BloxQuiz",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${quiz.title} — Free ${quiz.game} Quiz | BloxQuiz`,
      description: quiz.intro
        ? quiz.intro.substring(0, 200)
        : `Think you know ${quiz.game}? Take this ${quiz.difficulty} quiz and find out!`,
    },
    alternates: {
      canonical: `https://www.bloxquiz.gg/quiz/${slug}`,
    }
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
  const gameSlug = quiz.game.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const diffColor: Record<string, string> = {
    Easy: "#00f5a0",
    Medium: "#ffd700",
    Hard: "#ff3cac",
  };

  const faqs = (quiz.faqs && Array.isArray(quiz.faqs) && quiz.faqs.length > 0)
    ? quiz.faqs
    : [
        {
          question: `How many questions are in the ${quiz.title}?`,
          answer: `This quiz contains ${questionCount} multiple choice questions.`
        },
        {
          question: `What difficulty is the ${quiz.title}?`,
          answer: `This is ${article} ${quiz.difficulty} difficulty quiz, suitable for ${quiz.difficulty === "Easy" ? "beginners just starting out" : quiz.difficulty === "Medium" ? "players with some experience" : "expert players who know the game deeply"}.`
        },
        {
          question: `Is the ${quiz.game} quiz free to play?`,
          answer: `Yes! All quizzes on BloxQuiz are completely free to play. Sign up to save your scores and compete on the leaderboard.`
        },
        {
          question: `How do I improve my ${quiz.game} knowledge?`,
          answer: `Practice by playing more ${quiz.game} quizzes on BloxQuiz, watch YouTube tutorials, and spend time playing the actual game on Roblox.`
        }
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
        ]
      },
      {
        "@type": "WebPage",
        "@id": `https://www.bloxquiz.gg/quiz/${slug}`,
        "url": `https://www.bloxquiz.gg/quiz/${slug}`,
        "name": `${quiz.title} | BloxQuiz`,
        "description": quiz.intro
          ? quiz.intro.substring(0, 200)
          : `Test your ${quiz.game} knowledge with this ${quiz.difficulty} quiz. ${questionCount} questions covering ${quiz.game} gameplay, mechanics and more.`,
        "inLanguage": "en-US",
        "isPartOf": { "@id": "https://www.bloxquiz.gg" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Server-rendered editorial block — crawlable by Google */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 0" }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 20, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
          <span>›</span>
          <a href={`/games/${gameSlug}`} style={{ color: "var(--text-dim)", textDecoration: "none" }}>{quiz.game} Quizzes</a>
          <span>›</span>
          <span style={{ color: "var(--text-muted)" }}>{quiz.title}</span>
        </nav>

        {/* Title + badges */}
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 32px)", marginBottom: 16, lineHeight: 1.2, color: "var(--text)" }}>
          {quiz.title}
        </h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: `${diffColor[quiz.difficulty] || "#fff"}20`, color: diffColor[quiz.difficulty] || "#fff", border: `1px solid ${diffColor[quiz.difficulty] || "#fff"}40` }}>
            {quiz.difficulty}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
            {questionCount} Questions
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
            🎮 {quiz.game}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
            Free to Play
          </span>
        </div>

        {/* Intro paragraph */}
        <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 24, maxWidth: 680 }}>
          {quiz.intro || `Think you know ${quiz.game}? This ${quiz.difficulty.toLowerCase()} quiz covers ${questionCount} questions on ${quiz.game} — from core mechanics to the details most players miss. Test your knowledge, earn XP, and see how you rank against other players on BloxQuiz.`}
        </p>

        {/* What this quiz tests */}
        <div style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 14 }}>
            What This Quiz Tests
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {whatThisTestes.map((bullet, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.5 }}>
                <span style={{ color: "#00f5a0", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>✓</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Who should play */}
        <div style={{ background: "linear-gradient(135deg, rgba(0,180,216,0.06), rgba(184,76,255,0.04))", border: "1px solid rgba(0,180,216,0.15)", borderRadius: 12, padding: "16px 20px", marginBottom: 28 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#00b4d8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Who Should Play This</span>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 600, lineHeight: 1.6 }}>
            {whoShouldPlay}
          </p>
        </div>
      </div>

      <QuizClient quiz={quiz} slug={slug} faqs={faqs} relatedQuizzes={relatedQuizzes} currentSeason={currentSeason} />
    </>
  );
}