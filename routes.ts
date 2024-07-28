export const publicRoute = ["/", "/auth/verify-email"];

// Routes used for authentication
export const authRoute = [
  "/auth/register",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/error",
];

// Routes with only admin access
export const adminRoute = ["/admin", "/manage"];

// Routes for authenticated users(verified and logged in)
export const userRoute = ["/home"];

export const apiPrefix = "/api/auth";

// Default route after login
export const DEFAULT_LOGIN = "/home";
