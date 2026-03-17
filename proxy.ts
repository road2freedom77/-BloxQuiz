import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default clerkMiddleware((auth, request: NextRequest) => {
  // 301 redirect timestamp-suffixed quiz slugs to canonical slug
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
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};