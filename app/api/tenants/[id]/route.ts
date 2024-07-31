import { db } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || !session.user.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }
  const id = request.url.split("/").pop();
  if (!id) {
    return new Response("Tenant ID is required", { status: 400 });
  }
  const body = await request.json();

  const { name, description } = body;

  if (!name || !description) {
    return new Response("Name and description are required", { status: 400 });
  }

  try {
    const updatedTenant = await db.tenant.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
      },
    });

    return new Response(JSON.stringify(updatedTenant));
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session || !session.user.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }
  const id = request.url.split("/").pop();
  if (!id) {
    return new Response("Tenant ID is required", { status: 400 });
  }

  try {
    await db.tenant.delete({
      where: {
        id: id,
      },
    });

    return new Response("Tenant deleted successfully");
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
