import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Public routes that don't need authentication
  const publicPaths = ["/login", "/signup"];

  // Allow if it's a public route
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow Next.js internal/static/api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/cursor-arrowhead.svg")
  ) {
    return NextResponse.next();
  }

  // ✅ If token is missing, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ No JWT verification here (Edge-safe)
  // Just checking presence is enough
  return NextResponse.next();
}

// ✅ Apply middleware to all app routes except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
