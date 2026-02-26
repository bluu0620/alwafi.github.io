"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveTeacherSubjects(levelId: string, subjects: string[]) {
  const user = await currentUser();
  if (!user) throw new Error("غير مصرح");

  const role = user.unsafeMetadata?.role as string;
  if (role !== "teacher" && role !== "admin") throw new Error("غير مصرح");

  const client = await clerkClient();
  const current = (user.unsafeMetadata?.teacherSubjects as Record<string, string[]> | undefined) ?? {};
  current[levelId] = subjects;

  await client.users.updateUserMetadata(user.id, {
    unsafeMetadata: {
      ...user.unsafeMetadata,
      teacherSubjects: current,
    },
  });

  revalidatePath(`/dashboard/teacher/class/${levelId}`);
}
