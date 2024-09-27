import NextAuth from "next-auth";
import authConfig from "./auth.config";
import google from "next-auth/providers/google";
import facebook from "next-auth/providers/facebook";
import { redirect } from "next/dist/server/api-utils";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [google, facebook],
});
