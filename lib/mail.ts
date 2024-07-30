import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const url = process.env.NEXT_PUBLIC_URL;
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationURL = `${url}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address.</p>
        <a href="${verificationURL}">Verify email</a>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const passwordResetURL = `${url}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password.</p>
        <a href="${passwordResetURL}">Reset password</a>
    `,
  });
};
