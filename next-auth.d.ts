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
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: number;
  }
}

// import { DefaultUser } from "next-auth";
// declare module "next-auth" {
//   interface Session {
//     user?: DefaultUser & { id: string; isAdmin: boolean };
//   }
//   interface User extends DefaultUser {
//     isAdmin: boolean;
//   }
// }

// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface User {
//     // Add your additional properties here:
//     id: string;
//     isAdmin: boolean;
//   }
// }

// declare module "@auth/core/adapters" {
//   interface AdapterUser {
//     // Add your additional properties here:
//     id: string;
//     isAdmin: boolean;
//   }
// }
