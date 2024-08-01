import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const usersAskingAccess = await db.user.findMany({
      where: {
        emailVerified: {
          not: null,
        },
        isAdmin: {
          equals: false,
        },
      },
    });
    return new Response(JSON.stringify(usersAskingAccess));
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
