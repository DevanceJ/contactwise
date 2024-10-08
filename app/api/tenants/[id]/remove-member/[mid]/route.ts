import { db } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const isAdmin = session.user.isAdmin;

    const urlParts = request.url.split("/");
    const tenantId = urlParts[urlParts.length - 3];
    const memberId = urlParts[urlParts.length - 1];

    if (!tenantId || !memberId) {
      return new Response("Tenant ID and Member ID are required", {
        status: 400,
      });
    }

    const member = await db.member.findUnique({
      where: {
        userId_tenantId: {
          userId: String(userId),
          tenantId: String(tenantId),
        },
      },
    });

    if (!isAdmin && (!member || member.role !== "MANAGER")) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Delete the member
    await db.member.delete({
      where: {
        id: String(memberId),
      },
    });

    return new Response("Member removed", { status: 200 });
  } catch (error) {
    // console.error("Error removing member:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
