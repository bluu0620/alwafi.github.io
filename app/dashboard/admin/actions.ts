"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { LEVELS } from "@/lib/program-data";

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.unsafeMetadata?.role !== "admin") {
    redirect("/");
  }
  return user;
}

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin();
  const client = await clerkClient();
  const existingUser = await client.users.getUser(userId);
  await client.users.updateUser(userId, {
    unsafeMetadata: {
      ...existingUser.unsafeMetadata,
      role,
    },
  });
  revalidatePath("/dashboard/admin");
}

export async function updateStudentLevel(userId: string, level: string) {
  await requireAdmin();
  if (level && !Object.keys(LEVELS).includes(level)) {
    throw new Error("مستوى غير صالح");
  }
  const client = await clerkClient();
  const existingUser = await client.users.getUser(userId);
  await client.users.updateUser(userId, {
    unsafeMetadata: {
      ...existingUser.unsafeMetadata,
      level: level || undefined,
    },
  });
  revalidatePath("/dashboard/admin");
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  const client = await clerkClient();
  await client.users.deleteUser(userId);
  revalidatePath("/dashboard/admin");
}
