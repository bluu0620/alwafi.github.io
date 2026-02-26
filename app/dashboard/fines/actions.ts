"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type Fine = {
  id: string;
  reason: "phone" | "language" | "other";
  otherNote?: string;
  issuedByName: string;
  issuedById: string;
  issuedAt: string;
};

export const FINE_REASONS: Record<string, string> = {
  phone: "استخدام الهاتف في الوافي",
  language: "التحدث بغير العربية",
  other: "أخرى",
};

async function requireIssuable() {
  const user = await currentUser();
  const role = user?.unsafeMetadata?.role as string | undefined;
  if (!user || (role !== "teacher" && role !== "graduate" && role !== "admin")) {
    redirect("/");
  }
  return user;
}

export async function addFineAction(formData: FormData) {
  const issuer = await requireIssuable();
  const studentId = formData.get("studentId") as string;
  const reason = formData.get("reason") as "phone" | "language" | "other";
  const otherNote = (formData.get("otherNote") as string) || undefined;

  if (!studentId || !reason) return;

  const client = await clerkClient();
  const student = await client.users.getUser(studentId);
  const existingFines = (student.unsafeMetadata?.fines as Fine[] | undefined) ?? [];

  const newFine: Fine = {
    id: crypto.randomUUID(),
    reason,
    otherNote: reason === "other" ? otherNote : undefined,
    issuedByName:
      `${issuer.firstName ?? ""} ${issuer.lastName ?? ""}`.trim() || "غير معروف",
    issuedById: issuer.id,
    issuedAt: new Date().toISOString(),
  };

  await client.users.updateUser(studentId, {
    unsafeMetadata: {
      ...student.unsafeMetadata,
      fines: [...existingFines, newFine],
    },
  });

  revalidatePath("/dashboard/fines");
  revalidatePath(`/dashboard/profile/${studentId}`);
  revalidatePath("/dashboard/admin");
}

export async function removeFineAction(formData: FormData) {
  const user = await currentUser();
  if (!user || user.unsafeMetadata?.role !== "admin") {
    redirect("/");
  }

  const studentId = formData.get("studentId") as string;
  const fineId = formData.get("fineId") as string;

  if (!studentId || !fineId) return;

  const client = await clerkClient();
  const student = await client.users.getUser(studentId);
  const existingFines = (student.unsafeMetadata?.fines as Fine[] | undefined) ?? [];

  await client.users.updateUser(studentId, {
    unsafeMetadata: {
      ...student.unsafeMetadata,
      fines: existingFines.filter((f) => f.id !== fineId),
    },
  });

  revalidatePath("/dashboard/fines");
  revalidatePath(`/dashboard/profile/${studentId}`);
  revalidatePath("/dashboard/admin");
}
