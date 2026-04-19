import type { Metadata } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import RobuxAffiliateOverlay from "./components/RobuxAffiliateOverlay";
import RobuxBackground from "./components/RobuxBackground";
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
  title: "BloxQuiz — Roblox Quizzes, Live Stats & Game Codes (2026)",
  description: "Test your Roblox knowledge! Free trivia quizzes for Blox Fruits, Brookhaven, Adopt Me, Tower of Hell & more. Daily challenges, leaderboards & codes.",
  keywords: "Roblox quiz, Roblox trivia, Blox Fruits quiz, Brookhaven quiz, Adopt Me quiz, Roblox games, free Roblox quizzes, Roblox codes",
  verification: {
    google: "NqxJEMiRRquJUTiRoldLHa-Xl3R5kzUdwCGDuZFVdwk",
  },
  openGraph: {
    title: "BloxQuiz — Roblox Quizzes, Live Stats & Game Codes (2026)",
    description: "Test your Roblox knowledge! Free trivia quizzes for Blox Fruits, Brookhaven, Adopt Me & more.",
    url: "https://www.bloxquiz.gg",
    siteName: "BloxQuiz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloxQuiz — Roblox Quizzes, Live Stats & Game Codes (2026)",
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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00F5A0",
          colorBackground: "#13172A",
          colorInputBackground: "#1A1F35",
          colorInputText: "#F0F4FF",
          colorText: "#F0F4FF",
          colorTextSecondary: "#8892B0",
          colorDanger: "#FF3CAC",
          borderRadius: "12px",
        },
        elements: {
          card: {
            background: "#13172A",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            borderRadius: "16px",
          },
          headerTitle: { color: "#F0F4FF", fontWeight: 800 },
          headerSubtitle: { color: "#8892B0" },
          socialButtonsBlockButton: {
            background: "#1A1F35",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#F0F4FF",
            borderRadius: "10px",
            fontWeight: 700,
          },
          socialButtonsBlockButtonText: { color: "#F0F4FF" },
          dividerLine: { background: "rgba(255,255,255,0.08)" },
          dividerText: { color: "#8892B0" },
          formFieldLabel: { color: "#8892B0", fontWeight: 700, fontSize: "13px" },
          formFieldInput: {
            background: "#1A1F35",
            border: "1.5px solid rgba(255,255,255,0.1)",
            color: "#F0F4FF",
            borderRadius: "10px",
          },
          formButtonPrimary: {
            background: "linear-gradient(135deg, #00F5A0, #B84CFF)",
            color: "#0B0E17",
            fontWeight: 900,
            borderRadius: "100px",
            border: "none",
          },
          footerActionLink: { color: "#00F5A0", fontWeight: 700 },
        }
      }}
    >
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
          <Script
            id="google-adsense"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4722330934533465"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </head>
        <body className={`${lilitaOne.variable} ${nunito.variable}`} style={{ position: "relative" }}>
          <RobuxBackground />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Nav />
            {children}
            <Footer />
          </div>
          <RobuxAffiliateOverlay />
        </body>
      </html>
    </ClerkProvider>
  );
}