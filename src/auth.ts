import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import db from "./lib/db";
import * as schema from "./lib/schema";
import { eq, and } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await db.select().from(schema.users)
            .where(and(
              eq(schema.users.email, credentials.email as string),
              eq(schema.users.password, credentials.password as string)
            ))
            .limit(1);

          if (user[0]) {
            return { 
              id: user[0].id, 
              name: user[0].name, 
              email: user[0].email,
              role: user[0].role 
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
