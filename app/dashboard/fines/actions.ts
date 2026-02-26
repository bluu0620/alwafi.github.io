"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { logAuditEvent } from "@/lib/audit-log";
import { type Fine, FINE_REASONS } from "./types";

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

  const studentName =
    `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
    student.emailAddresses[0]?.emailAddress ||
    "Unknown";
  const issuerName =
    `${issuer.firstName ?? ""} ${issuer.lastName ?? ""}`.trim() || "Unknown";
  await logAuditEvent(
    issuer.id,
    issuerName,
    "Fine Issued",
    `${studentName} — ${FINE_REASONS[reason] ?? reason}${reason === "other" && otherNote ? `: ${otherNote}` : ""}`
  );

  revalidatePath("/dashboard/fines");
  revalidatePath(`/dashboard/profile/${studentId}`);
  revalidatePath("/dashboard/admin");
}

export async function toggleFinePaymentAction(formData: FormData) {
  const user = await currentUser();
  const role = user?.unsafeMetadata?.role as string | undefined;
  if (!user || (role !== "admin" && role !== "dev")) redirect("/");

  const studentId = formData.get("studentId") as string;
  const fineId = formData.get("fineId") as string;
  if (!studentId || !fineId) return;

  const client = await clerkClient();
  const student = await client.users.getUser(studentId);
  const existingFines = (student.unsafeMetadata?.fines as Fine[] | undefined) ?? [];

  await client.users.updateUser(studentId, {
    unsafeMetadata: {
      ...student.unsafeMetadata,
      fines: existingFines.map((f) =>
        f.id === fineId ? { ...f, paid: !f.paid } : f
      ),
    },
  });

  revalidatePath("/dashboard/fines");
  revalidatePath(`/dashboard/profile/${studentId}`);
  revalidatePath("/dashboard/admin");
}

export async function removeFineAction(formData: FormData) {
  const user = await currentUser();
  const role = user?.unsafeMetadata?.role as string | undefined;
  if (!user || (role !== "admin" && role !== "dev")) {
    redirect("/");
  }

  const studentId = formData.get("studentId") as string;
  const fineId = formData.get("fineId") as string;

  if (!studentId || !fineId) return;

  const client = await clerkClient();
  const student = await client.users.getUser(studentId);
  const existingFines = (student.unsafeMetadata?.fines as Fine[] | undefined) ?? [];
  const removedFine = existingFines.find((f) => f.id === fineId);

  await client.users.updateUser(studentId, {
    unsafeMetadata: {
      ...student.unsafeMetadata,
      fines: existingFines.filter((f) => f.id !== fineId),
    },
  });

  const studentName =
    `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
    student.emailAddresses[0]?.emailAddress ||
    "Unknown";
  const adminName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Admin";
  await logAuditEvent(
    user.id,
    adminName,
    "Fine Removed",
    `${studentName} — ${removedFine ? (FINE_REASONS[removedFine.reason] ?? removedFine.reason) : "Unknown fine"}`
  );

  revalidatePath("/dashboard/fines");
  revalidatePath(`/dashboard/profile/${studentId}`);
  revalidatePath("/dashboard/admin");
}
