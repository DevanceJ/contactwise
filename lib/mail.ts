import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const url = process.env.NEXT_PUBLIC_URL;
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationURL = `${url}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "noreply@mail.divi.wtf",
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
    from: "noreply@mail.divi.wtf",
    to: email,
    subject: "Reset your password",
    html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password.</p>
        <a href="${passwordResetURL}">Reset password</a>
    `,
  });
};

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "noch.email.contact@gmail.com",
//     pass: process.env.PASSWORD,
//   },
// });

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const verificationURL = `${process.env.NEXT_PUBLIC_URL}/auth/verify-email?token=${token}`;

//   await new Promise((resolve, reject) => {
//     transporter.verify(function (error, success) {
//       if (error) {
//         console.log(error);
//         reject(error);
//       } else {
//         console.log("Server is ready");
//         resolve(success);
//       }
//     });
//   });
//   await transporter.sendMail({
//     from: "noch.email.contact@gmail.com",
//     to: email,
//     subject: "Noch: Verify your email",
//     html: `
//         <h1>Verify your email</h1>
//         <p>Click the link below to verify your email address.</p>
//         <a href="${verificationURL}">Verify email</a>
//     `,
//   });
// };

// export const sendPasswordResetEmail = async (email: string, token: string) => {
//   const passwordResetURL = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${token}`;

//   await new Promise((resolve, reject) => {
//     transporter.verify(function (error, success) {
//       if (error) {
//         console.log(error);
//         reject(error);
//       } else {
//         console.log("Server is ready");
//         resolve(success);
//       }
//     });
//   });
//   await transporter.sendMail({
//     from: "noch.email.contact@gmail.com",
//     to: email,
//     subject: "Noch: Reset your password",
//     html: `
//         <h1>Reset your password</h1>
//         <p>Click the link below to reset your password.</p>
//         <a href="${passwordResetURL}">Reset password</a>
//     `,
//   });
// };
