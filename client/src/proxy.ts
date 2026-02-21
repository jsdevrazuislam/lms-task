import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Quality gate test

// Define protected and public routes
const publicRoutes = ["/login", "/register", "/"];
/*
const roleRoutes = {
    SUPER_ADMIN: ['/super-admin', '/admin', '/instructor', '/student'],
    ADMIN: ['/admin', '/instructor', '/student'],
    INSTRUCTOR: ['/instructor', '/student'],
    STUDENT: ['/student'],
};
*/

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const token = request.cookies.get("token")?.value; // Prefer HttpOnly cookie for production

  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  // 1. If no token and not public route -> Redirect to Login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If token and at public route -> Redirect to Dashboard
  // Only redirect if they are trying to access login/register,
  // keeping '/' accessible or redirecting to dashboard based on preference.
  if (
    token &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
