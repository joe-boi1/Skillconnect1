import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/session";

// Which role owns which top-level route segment.
const ROLE_PREFIXES: Record<string, "CUSTOMER" | "ARTISAN" | "ADMIN"> = {
  "/customer": "CUSTOMER",
  "/artisan": "ARTISAN",
  "/admin": "ADMIN",
};

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

function homeFor(role: "CUSTOMER" | "ARTISAN" | "ADMIN") {
  if (role === "CUSTOMER") return "/customer/home";
  if (role === "ARTISAN") return "/artisan/dashboard";
  return "/admin/dashboard";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const protectedPrefix = Object.keys(ROLE_PREFIXES).find((p) => pathname.startsWith(p));

  // Protected area: must be logged in, and must hold the matching role.
  if (protectedPrefix) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const requiredRole = ROLE_PREFIXES[protectedPrefix];
    if (session.role !== requiredRole) {
      // Logged in, but as the wrong role — send them to their own home
      // instead of exposing another role's area.
      const url = req.nextUrl.clone();
      url.pathname = homeFor(session.role);
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Already logged in and visiting an auth page — bounce to their home.
  if (session && AUTH_PAGES.some((p) => pathname === p)) {
    const url = req.nextUrl.clone();
    url.pathname = homeFor(session.role);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/artisan/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
