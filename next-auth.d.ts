import NextAuth, { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  isAdmin: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
