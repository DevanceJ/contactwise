import { getVerificationTokenbyEmail } from "@/data/verification";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour
  const existingToken = await getVerificationTokenbyEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 15); // 15 minutes
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
  return passwordResetToken;
};
