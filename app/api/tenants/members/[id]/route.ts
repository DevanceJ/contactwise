import { db } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tenantId = request.url.split("/").pop();

  if (!tenantId) {
    return new Response("Tenant ID is required", { status: 400 });
  }

  try {
    // Fetch all members for the tenant and the user
    const members = await db.member.findMany({
      where: {
        tenantId,
      },
      include: {
        user: true,
      },
    });

    return new Response(JSON.stringify(members));
  } catch (error) {
    return null;
  }
}
