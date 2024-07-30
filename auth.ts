import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "@/data/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }: any) {
      // allow google sign in
      if (account.provider === "google") {
        return true;
      }
      // no sign in for unverified users
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    async jwt({ token }) {
      // console.log({ token });
      // console.log({ user });
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.id = existingUser.id;
        token.isAdmin = existingUser.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.isAdmin = token.isAdmin as boolean;
      return session;
    },
  },
  ...authConfig,
});
