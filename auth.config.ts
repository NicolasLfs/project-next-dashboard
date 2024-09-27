import type { NextAuthConfig } from "next-auth";
import google from "next-auth/providers/google";
import facebook from "next-auth/providers/facebook";

export default {
  pages: {
    signIn: "/login",
  },
  providers: [
    google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      async profile(profile) {
        return { ...profile };
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      async profile(profile) {
        return { ...profile };
      },
    }),
  ],
} satisfies NextAuthConfig;
