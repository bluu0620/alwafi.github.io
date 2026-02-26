"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getLevelsConfig, saveLevelsConfig } from "@/lib/level-config";
import { LEVELS } from "@/lib/program-data";

export async function updateLevelConfig(formData: FormData) {
  const user = await currentUser();
  if (!user || user.unsafeMetadata?.role !== "admin") throw new Error("غير مصرح");

  const levelId = formData.get("levelId") as string;
  if (!LEVELS[levelId]) throw new Error("مستوى غير صالح");

  const name = (formData.get("name") as string)?.trim();
  const shortName = (formData.get("shortName") as string)?.trim();
  const leader = (formData.get("leader") as string)?.trim() ?? "";
  const subjectsRaw = formData.get("subjects") as string;
  const subjects = JSON.parse(subjectsRaw) as { name: string; icon: string }[];

  if (!name) throw new Error("الاسم مطلوب");
  if (!shortName) throw new Error("الاسم المختصر مطلوب");
  if (!subjects.length) throw new Error("يجب وجود مادة واحدة على الأقل");

  const config = await getLevelsConfig();
  config[levelId] = { name, shortName, leader, subjects };
  await saveLevelsConfig(config);

  revalidatePath("/dashboard/admin");
  revalidatePath(`/dashboard/admin/levels/${levelId}`);
  revalidatePath(`/dashboard/teacher`);
  revalidatePath(`/dashboard/teacher/class/${levelId}`);
  revalidatePath(`/dashboard/student/homework`);
}

export async function resetLevelConfig(formData: FormData) {
  const user = await currentUser();
  if (!user || user.unsafeMetadata?.role !== "admin") throw new Error("غير مصرح");

  const levelId = formData.get("levelId") as string;
  if (!LEVELS[levelId]) throw new Error("مستوى غير صالح");

  const config = await getLevelsConfig();
  delete config[levelId];
  await saveLevelsConfig(config);

  revalidatePath("/dashboard/admin");
  revalidatePath(`/dashboard/admin/levels/${levelId}`);
  revalidatePath(`/dashboard/teacher/class/${levelId}`);
  revalidatePath(`/dashboard/student/homework`);
}
