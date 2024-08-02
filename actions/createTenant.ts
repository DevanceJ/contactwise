"use server";

import * as z from "zod";
import { TenantSchema } from "@/schema";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const createTenant = async (values: z.infer<typeof TenantSchema>) => {
  const data = await auth();
  const validatedFields = TenantSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const isAdmin = data?.user?.isAdmin;
  if (!isAdmin) {
    return { error: "Unauthorized" };
  }

  const { name, description } = validatedFields.data;
  const userId = data?.user?.id;
  try {
    const newTenant = await db.tenant.create({
      data: {
        name,
        description,
        createdById: userId,
      },
    });
    return { tenant: newTenant, success: "Tenant created" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create tenant" };
  }
};
