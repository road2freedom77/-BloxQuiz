import type { Metadata } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import "./globals.css";

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "BloxQuiz — Roblox Trivia & Quizzes for Every Game",
  description: "Test your Roblox knowledge! Trivia quizzes for Blox Fruits, Brookhaven, Adopt Me, Tower of Hell & more. Daily challenges, leaderboards & codes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lilitaOne.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}