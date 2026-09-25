// middleware.ts (project root)
// Rewrites every page route on bloxquiz.gg to the /shutdown announcement.
// Wrapped in clerkMiddleware so admin API routes (notify-shutdown) still authenticate.
// /api routes and static assets are excluded from the rewrite.
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  // Let the shutdown page itself and all API routes through
  if (pathname === "/shutdown" || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Everything else shows the announcement; 410 Gone tells crawlers content is permanently removed
  const url = req.nextUrl.clone();
  url.pathname = "/shutdown";
  return NextResponse.rewrite(url, { status: 410 });
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.*\\.xml|.*\\.(?:png|jpg|jpeg|svg|webp|ico)).*)"],
};