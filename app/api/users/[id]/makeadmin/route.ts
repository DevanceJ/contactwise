import { db } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user.isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }

    const urlParts = req.url.split("/");
    const userId = urlParts[urlParts.length - 2];

    await db.user.update({
      where: { id: userId },
      data: { isAdmin: true },
    });

    return new Response("Role changed", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
