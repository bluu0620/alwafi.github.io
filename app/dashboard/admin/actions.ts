"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { LEVELS } from "@/lib/program-data";
import { logAuditEvent } from "@/lib/audit-log";

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.unsafeMetadata?.role !== "admin") {
    redirect("/");
  }
  return user;
}

function adminName(user: { firstName: string | null; lastName: string | null }) {
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Admin";
}

function userName(u: { firstName: string | null; lastName: string | null; emailAddresses: { emailAddress: string }[] }) {
  return (
    `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
    u.emailAddresses[0]?.emailAddress ||
    "Unknown"
  );
}

const ROLE_LABELS_EN: Record<string, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  graduate: "Graduate",
};

export async function updateUserRole(userId: string, role: string) {
  const admin = await requireAdmin();
  const client = await clerkClient();
  const existingUser = await client.users.getUser(userId);
  await client.users.updateUser(userId, {
    unsafeMetadata: {
      ...existingUser.unsafeMetadata,
      role,
    },
  });
  await logAuditEvent(
    admin.id,
    adminName(admin),
    "Role Changed",
    `${userName(existingUser)} → ${ROLE_LABELS_EN[role] ?? role}`
  );
  revalidatePath("/dashboard/admin");
}

export async function updateStudentLevel(userId: string, level: string) {
  const admin = await requireAdmin();
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
  const levelLabel = level ? (LEVELS[level]?.name ?? level) : "None";
  await logAuditEvent(
    admin.id,
    adminName(admin),
    "Level Assigned",
    `${userName(existingUser)} → ${levelLabel}`
  );
  revalidatePath("/dashboard/admin");
}

export async function updateTeacherDepartment(userId: string, department: string) {
  const admin = await requireAdmin();
  if (department && !["language", "sharia"].includes(department)) {
    throw new Error("قسم غير صالح");
  }
  const client = await clerkClient();
  const existingUser = await client.users.getUser(userId);
  await client.users.updateUser(userId, {
    unsafeMetadata: {
      ...existingUser.unsafeMetadata,
      department: department || undefined,
    },
  });
  const deptLabel = department === "language" ? "لغوي" : department === "sharia" ? "شرعي" : "None";
  await logAuditEvent(
    admin.id,
    adminName(admin),
    "Dept Assigned",
    `${userName(existingUser)} → ${deptLabel}`
  );
  revalidatePath("/dashboard/admin");
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();
  const client = await clerkClient();
  const existingUser = await client.users.getUser(userId);
  const deletedName = userName(existingUser);
  const deletedEmail = existingUser.emailAddresses[0]?.emailAddress ?? "";
  await client.users.deleteUser(userId);
  await logAuditEvent(
    admin.id,
    adminName(admin),
    "User Deleted",
    `${deletedName} (${deletedEmail})`
  );
  revalidatePath("/dashboard/admin");
}
