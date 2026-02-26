"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LEVELS } from "@/lib/program-data";

export async function selectStudentLevel(level: string) {
  const user = await currentUser();

  if (!user || user.unsafeMetadata?.role !== "student") {
    redirect("/");
  }

  // Lock: once set, student cannot change their level
  if (user.unsafeMetadata?.level) {
    redirect("/dashboard/student");
  }

  // Validate the level is a known one
  if (!Object.keys(LEVELS).includes(level)) {
    throw new Error("مستوى غير صالح");
  }

  const client = await clerkClient();
  await client.users.updateUser(user.id, {
    unsafeMetadata: {
      ...user.unsafeMetadata,
      level,
    },
  });

  redirect("/dashboard/student");
}
