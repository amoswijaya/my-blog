import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("role")?.value;

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);
  if (authToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/articles", request.url));
    }
    if (userRole === "user" && !pathname.startsWith("/articles")) {
      return NextResponse.redirect(new URL("/articles", request.url));
    }
  } else {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
