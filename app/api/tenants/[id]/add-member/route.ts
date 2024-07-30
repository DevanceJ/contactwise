import { db } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request, res: Response) {
  const session = await auth();

  if (!session || !session.user.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { tenantId, userId, role } = await req.json();

  if (!tenantId || !userId || !role) {
    return new Response("Tenant ID, User ID, and Role are required", {
      status: 400,
    });
  }

  try {
    const existingMember = await db.member.findUnique({
      where: {
        userId_tenantId: {
          userId,
          tenantId: tenantId as string,
        },
      },
    });

    if (existingMember) {
      return new Response("User is already a member of this tenant", {
        status: 400,
      });
    }

    const newMember = await db.member.create({
      data: {
        userId,
        tenantId: tenantId as string,
        role,
      },
    });

    return new Response("User added to tenant successfully", { status: 200 });
  } catch (error) {
    return null;
  }
}
