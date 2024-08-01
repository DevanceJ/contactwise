import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const tenants = await db.tenant.findMany();
    return new Response(JSON.stringify(tenants));
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
