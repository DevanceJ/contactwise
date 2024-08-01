import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
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
