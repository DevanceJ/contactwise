import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const usersAskingAccess = await db.user.findMany({
      where: {
        requestedAdminAccess: {
          equals: true,
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
