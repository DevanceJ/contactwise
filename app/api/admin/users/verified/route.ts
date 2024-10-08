import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenantId");

  if (!tenantId) {
    return new Response("Tenant ID is required", { status: 400 });
  }

  try {
    const existingMembers = await db.member.findMany({
      where: { tenantId: tenantId as string },
      select: { userId: true },
    });
    const existingMemberIds = existingMembers.map((member) => member.userId);
    const verifiedUsers = await db.user.findMany({
      where: {
        id: {
          notIn: existingMemberIds,
        },
        emailVerified: {
          not: null,
        },
      },
    });
    return new Response(JSON.stringify(verifiedUsers));
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
