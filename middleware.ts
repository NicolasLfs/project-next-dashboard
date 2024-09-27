import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default NextAuth(authConfig).auth;

// Função de middleware
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/")) {
    return NextResponse.rewrite(new URL("/dashboard", request.url));
  }
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
};
