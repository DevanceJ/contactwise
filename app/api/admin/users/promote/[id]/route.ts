import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const userId = req.url.split("/").pop();

    await db.user.update({
      where: { id: userId },
      data: { isAdmin: true },
    });

    return new Response("Role changed", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
