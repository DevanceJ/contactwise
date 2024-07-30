import { db } from "@/lib/db";
import { auth } from "@/auth";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = session.user.id;
  // only admins can see all tenants
  if (session?.user.isAdmin === true) {
    try {
      const tenants = await db.tenant.findMany();
      return new Response(JSON.stringify(tenants));
    } catch (error) {
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // regular users can only see tenants they are members of
  try {
    const tenants = await db.tenant.findMany({
      where: {
        members: {
          some: {
            userId: String(id),
          },
        },
      },
    });
    return new Response(JSON.stringify(tenants));
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
