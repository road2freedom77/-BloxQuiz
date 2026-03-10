import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse All Roblox Quizzes | BloxQuiz",
  description: "Browse 200+ free Roblox quizzes across Blox Fruits, Adopt Me, Doors, Brookhaven and more. Filter by game or difficulty and test your knowledge today.",
  openGraph: {
    title: "Browse All Roblox Quizzes | BloxQuiz",
    description: "Browse 200+ free Roblox quizzes across Blox Fruits, Adopt Me, Doors, Brookhaven and more.",
    url: "https://www.bloxquiz.gg/browse",
    siteName: "BloxQuiz",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Browse All Roblox Quizzes | BloxQuiz",
    description: "Browse 200+ free Roblox quizzes across Blox Fruits, Adopt Me, Doors, Brookhaven and more.",
  },
  alternates: {
    canonical: "https://www.bloxquiz.gg/browse",
  },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}