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
    if (data) return data;
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

  // Apply any admin edits from Supabase
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

  const relatedQuizzes = await getRelatedQuizzes(slug, quiz.game);
  const article = quiz.difficulty === "Easy" ? "an" : "a";

  // Use unique FAQs from Supabase if available, otherwise fall back to generic
  const faqs = (quiz.faqs && Array.isArray(quiz.faqs) && quiz.faqs.length > 0)
    ? quiz.faqs
    : [
        {
          question: `How many questions are in the ${quiz.title}?`,
          answer: `This quiz contains ${quiz.questions.length} multiple choice questions.`
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
          { "@type": "ListItem", "position": 2, "name": `${quiz.game} Quizzes`, "item": `https://www.bloxquiz.gg/games/${quiz.game.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` },
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
          : `Test your ${quiz.game} knowledge with this ${quiz.difficulty} quiz. ${quiz.questions.length} questions covering ${quiz.game} gameplay, mechanics and more.`,
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

  const letters = ["A", "B", "C", "D"];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <noscript>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <h1>{quiz.title}</h1>
          <p>
            {quiz.intro || `${quiz.game} — ${quiz.difficulty} difficulty — ${quiz.questions.length} multiple choice questions. Free ${quiz.game} trivia quiz on BloxQuiz.gg. Test your knowledge, earn XP and compete on the leaderboard.`}
          </p>
          <ol>
            {quiz.questions.map((question: any, i: number) => (
              <li key={i} style={{ marginBottom: 16 }}>
                <p><strong>Question {i + 1}:</strong> {question.q}</p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {question.a.map((answer: string, j: number) => (
                    <li key={j}>{letters[j]}. {answer}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </noscript>

      <section
        aria-label={`${quiz.title} - All Questions`}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        <h2>{quiz.title}</h2>
        <p>
          {quiz.intro || `${quiz.game} ${quiz.difficulty} quiz with ${quiz.questions.length} questions. Topics covered include ${quiz.game} gameplay, strategies, items, and mechanics. Play free on BloxQuiz.gg and compete on the leaderboard.`}
        </p>
        {quiz.questions.map((question: any, i: number) => (
          <div key={i}>
            <h3>Question {i + 1}: {question.q}</h3>
            <ul>
              {question.a.map((answer: string, j: number) => (
                <li key={j}>{letters[j]}. {answer}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <QuizClient quiz={quiz} slug={slug} faqs={faqs} relatedQuizzes={relatedQuizzes} />
    </>
  );
}