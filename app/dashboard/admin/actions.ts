"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
  await client.users.updateUser(userId, {
    unsafeMetadata: { role },
  });
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  const client = await clerkClient();
  await client.users.deleteUser(userId);
}
