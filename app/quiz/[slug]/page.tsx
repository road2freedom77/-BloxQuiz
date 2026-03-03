import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { supabase } from "../../lib/supabase";
import QuizClient from "./QuizClient";

function getQuiz(slug: string) {
  const staticQuizzes: Record<string, any> = {
    "blox-fruits-ultimate": {
      title: "Ultimate Blox Fruits Expert Quiz",
      game: "Blox Fruits",
      difficulty: "Hard",
      questions: [
        { q: "Which Blox Fruits fruit is considered the rarest Mythical in the game?", a: ["Kitsune", "Dragon", "Leopard", "T-Rex"], correct: 0 },
        { q: "What level do you need to reach to enter the Second Sea in Blox Fruits?", a: ["Level 500", "Level 700", "Level 1000", "Level 1500"], correct: 1 },
        { q: "Which NPC gives you the Race Awakening quest in Blox Fruits?", a: ["Arowe", "The Gorilla King", "Phoeyu", "Tort"], correct: 0 },
        { q: "What is the maximum level cap in Blox Fruits as of 2025?", a: ["2400", "2550", "2700", "2850"], correct: 2 },
        { q: "Which fighting style requires fragments to unlock?", a: ["Superhuman", "Electric Claw", "Dragon Talon", "Sharkman Karate"], correct: 2 },
        { q: "Which Roblox game holds the record for most visits of all time?", a: ["Adopt Me!", "Blox Fruits", "Brookhaven RP", "Tower of Hell"], correct: 2 },
        { q: "What year was Roblox officially launched to the public?", a: ["2004", "2006", "2008", "2010"], correct: 1 },
        { q: "Which Adopt Me! pet was the first ever Legendary?", a: ["Shadow Dragon", "Frost Dragon", "Blue Dog", "Pink Cat"], correct: 2 },
        { q: "How many Robux does a $10 USD purchase give you?", a: ["400", "800", "1000", "1700"], correct: 1 },
        { q: "In Brookhaven, what's the secret code to access the hidden bunker?", a: ["There is no code", "4321", "0000", "1234"], correct: 0 },
      ]
    },
    "brookhaven-secrets": {
      title: "Brookhaven Secrets You Didn't Know",
      game: "Brookhaven",
      difficulty: "Easy",
      questions: [
        { q: "What is the name of the hospital in Brookhaven?", a: ["Brookhaven Hospital", "City Medical Center", "St. Mary's", "General Hospital"], correct: 0 },
        { q: "How many garages are in Brookhaven?", a: ["1", "2", "3", "4"], correct: 1 },
        { q: "Which vehicle is the fastest in Brookhaven?", a: ["Sports Car", "Motorcycle", "Supercar", "Truck"], correct: 2 },
        { q: "What color is the Brookhaven police car?", a: ["Blue and white", "Black and white", "All black", "All white"], correct: 1 },
        { q: "Which building has a secret underground room?", a: ["The Bank", "The School", "The Church", "The Hospital"], correct: 0 },
        { q: "What is the maximum number of players in a Brookhaven server?", a: ["10", "15", "20", "25"], correct: 2 },
        { q: "Which item lets you fly in Brookhaven?", a: ["Jetpack", "Wings", "Balloon", "Hoverboard"], correct: 0 },
        { q: "What year was Brookhaven RP released?", a: ["2018", "2019", "2020", "2021"], correct: 2 },
        { q: "Who created Brookhaven RP?", a: ["Wolfpaq", "Badimo", "Adopt Me Team", "Roblox Corp"], correct: 0 },
        { q: "What is the name of the school in Brookhaven?", a: ["Brookhaven High", "Roblox Academy", "City School", "Brookhaven School"], correct: 3 },
      ]
    },
    "adopt-me-pets": {
      title: "Name That Pet! — Adopt Me Edition",
      game: "Adopt Me!",
      difficulty: "Medium",
      questions: [
        { q: "Which pet was available in the very first Adopt Me egg?", a: ["Dog", "Cat", "Unicorn", "Dragon"], correct: 0 },
        { q: "What is the rarest pet in Adopt Me?", a: ["Shadow Dragon", "Frost Dragon", "Bat Dragon", "Evil Unicorn"], correct: 0 },
        { q: "How many eggs are needed to hatch a legendary in the Royal Egg?", a: ["1", "It's random", "5", "10"], correct: 1 },
        { q: "Which pet glows in the dark?", a: ["Neon Pet", "Shadow Dragon", "Ghost Dragon", "All of the above"], correct: 3 },
        { q: "What currency is used in Adopt Me?", a: ["Robux", "Bucks", "Coins", "Stars"], correct: 1 },
        { q: "Which pet can be obtained from the Farm Egg?", a: ["Cow", "Horse", "Pig", "All of the above"], correct: 3 },
        { q: "What is the name of the main city in Adopt Me?", a: ["Adoption Island", "Pet City", "Roblox Town", "Adopt City"], correct: 0 },
        { q: "How many stages does a pet have?", a: ["3", "4", "5", "6"], correct: 1 },
        { q: "Which egg costs the most Bucks?", a: ["Royal Egg", "Pet Egg", "Cracked Egg", "Farm Egg"], correct: 0 },
        { q: "What was the first limited pet in Adopt Me?", a: ["Halloween Cat", "Blue Dog", "Pink Cat", "Ghost Dragon"], correct: 2 },
      ]
    },
    "which-roblox-game": {
      title: "Which Roblox Game Are You?",
      game: "All Games",
      difficulty: "Medium",
      questions: [
        { q: "What do you enjoy most in games?", a: ["Fighting & combat", "Roleplay & socializing", "Collecting & trading", "Parkour & challenges"], correct: 0 },
        { q: "How competitive are you?", a: ["Very competitive", "Somewhat competitive", "Not at all", "Only with friends"], correct: 0 },
        { q: "What's your favorite game setting?", a: ["Fantasy ocean world", "Suburban neighborhood", "Magical pet world", "Obstacle course"], correct: 0 },
        { q: "How long do you play per session?", a: ["1-2 hours grinding", "30 mins casual", "All day collecting", "Quick 10 min runs"], correct: 0 },
        { q: "What motivates you most?", a: ["Getting stronger", "Making friends", "Owning rare items", "Beating records"], correct: 0 },
        { q: "Pick a color:", a: ["Red & orange", "Blue & purple", "Pink & yellow", "Green & white"], correct: 0 },
        { q: "Favorite type of challenge?", a: ["Boss battles", "Social scenarios", "Trading puzzles", "Physical obstacles"], correct: 0 },
        { q: "What's your playstyle?", a: ["Aggressive", "Chill", "Strategic", "Speedrunner"], correct: 0 },
        { q: "Pick a superpower:", a: ["Super strength", "Invisibility", "Mind control", "Super speed"], correct: 0 },
        { q: "What do you want from a game?", a: ["Power & progression", "Fun & freedom", "Collection & value", "Skill & precision"], correct: 0 },
      ]
    }
  };

  if (staticQuizzes[slug]) return staticQuizzes[slug];

  try {
    const filePath = path.join(process.cwd(), `app/data/quizzes/${slug}.json`);
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

function getRelatedQuizzes(currentSlug: string, game: string) {
  const related: any[] = [];
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      if (slug === currentSlug) continue;
      const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      if (content.game === game) {
        related.push({
          slug,
          title: content.title,
          game: content.game,
          difficulty: content.difficulty,
          questions: content.questions?.length || 10,
        });
      }
      if (related.length >= 6) break;
    }
  } catch (e) {}
  return related;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuiz(slug);

  if (!quiz) return {
    title: "Quiz Not Found | BloxQuiz",
    description: "This quiz could not be found."
  };

  const cleanSlug = slug.replace(/-/g, ' ');

  return {
    title: `${quiz.title} | BloxQuiz — Roblox Trivia`,
    description: `Test your ${quiz.game} knowledge! ${quiz.questions.length} questions on ${cleanSlug}. Can you get a perfect score? Free Roblox quiz on BloxQuiz.gg`,
    openGraph: {
      title: `${quiz.title} | BloxQuiz`,
      description: `Think you know ${quiz.game}? Take this ${quiz.difficulty} quiz and find out!`,
      url: `https://www.bloxquiz.gg/quiz/${slug}`,
      siteName: "BloxQuiz",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${quiz.title} | BloxQuiz`,
      description: `Think you know ${quiz.game}? Take this ${quiz.difficulty} quiz and find out!`,
    },
    alternates: {
      canonical: `https://www.bloxquiz.gg/quiz/${slug}`,
    }
  };
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuiz(slug);

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

  const relatedQuizzes = getRelatedQuizzes(slug, quiz.game);
  const article = quiz.difficulty === "Easy" ? "an" : "a";
  const firstQ = quiz.questions[0];

  const faqs = [
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
        "description": `Test your ${quiz.game} knowledge with this ${quiz.difficulty} quiz. ${quiz.questions.length} questions covering ${quiz.game} gameplay, mechanics and more.`,
        "inLanguage": "en-US",
        "isPartOf": { "@id": "https://www.bloxquiz.gg" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
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

      {/* Clean SEO block — no question dump, no spoilers */}
      <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
        <p>{quiz.game + " — " + quiz.difficulty + " difficulty — " + quiz.questions.length + " multiple choice questions"}</p>
        <p>{"Free " + quiz.game + " trivia quiz on BloxQuiz.gg. Test your knowledge, earn XP and compete on the leaderboard."}</p>
        <p>{"Sample question (1 of " + quiz.questions.length + "):"}</p>
        <p>{firstQ.q}</p>
        <ul>
          {firstQ.a.map((answer: string, j: number) => (
            <li key={j}>
              <button type="button">{["A", "B", "C", "D"][j] + ". " + answer}</button>
            </li>
          ))}
        </ul>
      </div>

      <QuizClient quiz={quiz} slug={slug} faqs={faqs} relatedQuizzes={relatedQuizzes} />
    </>
  );
}