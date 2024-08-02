import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { auth as getSession } from "@/auth";

import {
  authRoute,
  apiPrefix,
  publicRoute,
  DEFAULT_LOGIN,
  adminRoute,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const session = await getSession();
  const isAdmin = session?.user.isAdmin;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiPrefix);
  const isPublicRoute = publicRoute.includes(nextUrl.pathname);
  const isAuthRoute = authRoute.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoute);

  if (isApiAuthRoute) {
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN, nextUrl));
    }
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  if (isAdminRoute) {
    if (!isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  return undefined;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
