import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import QuizClient from "./QuizClient";

function getQuiz(slug: string) {
  // Check static quizzes first
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

  // Check dynamic JSON files
  try {
    const filePath = path.join(process.cwd(), `app/data/quizzes/${slug}.json`);
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuiz(slug);

  if (!quiz) notFound();

  return <QuizClient quiz={quiz} slug={slug} />;
}