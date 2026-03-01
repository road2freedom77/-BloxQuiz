import type { Metadata } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
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
  description: "Test your Roblox knowledge! Free trivia quizzes for Blox Fruits, Brookhaven, Adopt Me, Tower of Hell & more. Daily challenges, leaderboards & codes.",
  keywords: "Roblox quiz, Roblox trivia, Blox Fruits quiz, Brookhaven quiz, Adopt Me quiz, Roblox games, free Roblox quizzes, Roblox codes",
  openGraph: {
    title: "BloxQuiz — Roblox Trivia & Quizzes",
    description: "Test your Roblox knowledge! Free trivia quizzes for Blox Fruits, Brookhaven, Adopt Me & more.",
    url: "https://www.bloxquiz.gg",
    siteName: "BloxQuiz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloxQuiz — Roblox Trivia & Quizzes",
    description: "Test your Roblox knowledge! Free trivia quizzes for Blox Fruits, Brookhaven, Adopt Me & more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.bloxquiz.gg",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-X1WQ0GMZDN"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X1WQ0GMZDN');
            `}
          </Script>
        </head>
        <body className={`${lilitaOne.variable} ${nunito.variable}`}>
          <Nav />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}