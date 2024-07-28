"use server";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

import * as z from "zod";
import { generatePasswordResetToken } from "@/lib/token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!token) {
    return { error: "Invalid token" };
  }

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date() > new Date(existingToken.expiresAt);
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User does not exist" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password reset!" };
};
