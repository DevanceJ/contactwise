"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

import { getVerificationTokenbyToken } from "@/data/verification";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenbyToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date() > new Date(existingToken.expiresAt);
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User does not exist" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};
