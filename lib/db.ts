import { PrismaClient } from "@prisma/client";

// global will be used to store the prisma client in development as hot reload will create multiple clients.
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = db;
}
