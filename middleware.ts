import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/browse",
  "/quiz/(.*)",
  "/games/(.*)",
  "/codes/(.*)",
  "/stats/(.*)",
  "/leaderboard",
  "/champions",
  "/roblox-username-ideas",
  "/rules",
  "/about",
  "/privacy",
  "/terms",
  "/contact",
  "/advertise",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/(.*)",
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Redirect timestamp-suffixed quiz slugs to canonical slug
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/quiz/")) {
    const slug = pathname.replace("/quiz/", "");
    const cleanSlug = slug.replace(/-\d{13,}$/, "");
    if (cleanSlug !== slug) {
      return NextResponse.redirect(
        new URL(`/quiz/${cleanSlug}`, request.url),
        301
      );
    }
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};