import { db } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, res: Response) {
  const session = await auth();

  if (!session || !session.user.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const urlParts = request.url.split("/");
  const tenantId = urlParts[urlParts.length - 3];
  const memberId = urlParts[urlParts.length - 1];

  if (!tenantId || !memberId) {
    return new Response("Tenant ID, User ID, and Role are required", {
      status: 400,
    });
  }

  try {
    await db.member.delete({
      where: {
        id: String(memberId),
        tenantId: String(tenantId),
      },
    });
    return new Response("Member removed", {
      status: 200,
    });
  } catch (error) {
    return null;
  }
}
