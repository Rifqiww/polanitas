/**
 * POLANITAS — Middleware
 *
 * Protects all /dashboard/* routes by checking for a valid __session cookie.
 * Unauthenticated users are redirected to /login.
 * Already-authenticated users visiting /login or /register are redirected to /dashboard.
 *
 * NOTE: Middleware runs on the Edge — do NOT import firebase-admin here.
 * We only check for the cookie's presence; deep verification happens in Server Actions/Components.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "__session";

const PUBLIC_PATHS = ["/", "/login", "/register", "/setup-profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  // Already authenticated → redirect away from auth pages (but NOT setup-profile)
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // /setup-profile requires a session but is not /dashboard
  if (pathname === "/setup-profile" && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protected routes → require session
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public/ assets
     */
    "/((?!_next/static|_next/image|favicon.ico|logo/|public/).*)",
  ],
};
