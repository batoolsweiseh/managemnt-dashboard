import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import db from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?')
            .get(credentials.email, credentials.password) as any;

          if (user) {
            return { 
              id: user.id, 
              name: user.name, 
              email: user.email,
              role: user.role 
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
        }
        return null;
      },
    }),
  ],
});
