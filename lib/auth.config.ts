import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { seedDefaultCategories } from "./seed-categories";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
    events: {
    async createUser({ user }) {
      if (user.id) {
        await seedDefaultCategories(user.id);
      }
    },
  },
callbacks: {
  jwt({ token, user, trigger, session }) {
    if (user) token.id = user.id;
    if (trigger === "update" && session) {
      token.name = session.name;
      token.picture = session.image;
    }
    return token;
  },
  session({ session, token }) {
    session.user.id = token.id as string;
    session.user.image = token.picture as string;
    return session;
  },
},
};