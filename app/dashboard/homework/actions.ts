"use server";

import { put, del } from "@vercel/blob";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type HomeworkData, type Submission } from "@/lib/homework-types";
import { LEVELS } from "@/lib/program-data";

export async function submitHomework(formData: FormData) {
  const user = await currentUser();
  if (!user || user.unsafeMetadata?.role !== "student") throw new Error("غير مصرح");

  const level = user.unsafeMetadata.level as string;
  const subject = formData.get("subject") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) throw new Error("لم يتم اختيار ملف");

  // Validate subject belongs to this level
  const levelData = LEVELS[level];
  if (!levelData?.subjects.some((s) => s.name === subject)) {
    throw new Error("مادة غير صالحة");
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const safeName = `homework/${user.id}/${level}/${encodeURIComponent(subject)}/${Date.now()}.${ext}`;

  const blob = await put(safeName, file, { access: "public" });

  const type: Submission["type"] = file.type.startsWith("audio/")
    ? "audio"
    : file.type.startsWith("image/")
    ? "image"
    : "file";

  const submission: Submission = {
    id: crypto.randomUUID(),
    type,
    url: blob.url,
    filename: file.name,
    size: file.size,
    submittedAt: new Date().toISOString(),
  };

  const client = await clerkClient();
  const fresh = await client.users.getUser(user.id);
  const existing = (fresh.unsafeMetadata.homework as HomeworkData) ?? {};

  await client.users.updateUser(user.id, {
    unsafeMetadata: {
      ...fresh.unsafeMetadata,
      homework: {
        ...existing,
        [subject]: [...(existing[subject] ?? []), submission],
      },
    },
  });

  revalidatePath("/dashboard/student/homework");
}

export async function deleteSubmission(subject: string, submissionId: string) {
  const user = await currentUser();
  if (!user || user.unsafeMetadata?.role !== "student") throw new Error("غير مصرح");

  const client = await clerkClient();
  const fresh = await client.users.getUser(user.id);
  const homework = (fresh.unsafeMetadata.homework as HomeworkData) ?? {};
  const submissions = homework[subject] ?? [];
  const toDelete = submissions.find((s) => s.id === submissionId);

  if (toDelete) {
    try {
      await del(toDelete.url);
    } catch {
      // Blob may already be gone
    }
  }

  await client.users.updateUser(user.id, {
    unsafeMetadata: {
      ...fresh.unsafeMetadata,
      homework: {
        ...homework,
        [subject]: submissions.filter((s) => s.id !== submissionId),
      },
    },
  });

  revalidatePath("/dashboard/student/homework");
}
