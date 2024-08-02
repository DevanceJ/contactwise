"use server";

import * as z from "zod";
import { AddUserSchema } from "@/schema";
import { db } from "@/lib/db";

export const addMember = async (values: z.infer<typeof AddUserSchema>) => {
  const validatedFields = AddUserSchema.safeParse(values);
  console.log(validatedFields);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { tenantId, userId, role } = validatedFields.data;
  try {
    const existingMember = await db.member.findUnique({
      where: {
        userId_tenantId: {
          userId,
          tenantId,
        },
      },
    });

    if (existingMember) {
      return { error: "User is already a member of this tenant" };
    }

    const newMember = await db.member.create({
      data: {
        userId,
        tenantId,
        role,
      },
    });

    return { success: "User added to tenant successfully" };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
};
