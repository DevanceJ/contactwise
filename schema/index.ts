import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Please enter a valid password",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  name: z.string().min(1, {
    message: "Please enter your name",
  }),
  requestAdminAccess: z.boolean().default(false).optional(),
});

export const TenantSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a valid tenant name",
  }),
  description: z.string().min(1, {
    message: "Please enter a valid description",
  }),
});

export const AddUserSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  role: z.enum(["MANAGER", "USER"]),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});
