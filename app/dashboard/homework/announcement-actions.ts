"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getAnnouncements, saveAnnouncements, type Announcement } from "@/lib/announcements";
import { LEVELS } from "@/lib/program-data";

export async function postAnnouncement(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("غير مصرح");

  const role = user.unsafeMetadata?.role as string;
  if (role !== "teacher" && role !== "admin") throw new Error("غير مصرح");

  const levelId = formData.get("levelId") as string;
  const subject = formData.get("subject") as string;
  const text = (formData.get("text") as string)?.trim();

  if (!LEVELS[levelId]) throw new Error("مستوى غير صالح");
  if (!text) throw new Error("النص مطلوب");

  const data = await getAnnouncements(levelId);
  if (!data[subject]) data[subject] = [];

  const announcement: Announcement = {
    id: Date.now().toString(),
    text,
    postedAt: new Date().toISOString(),
    teacherName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "معلم",
  };

  data[subject].push(announcement);
  await saveAnnouncements(levelId, data);

  revalidatePath(`/dashboard/teacher/class/${levelId}`);
  revalidatePath(`/dashboard/student/homework`);
}

export async function deleteAnnouncement(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("غير مصرح");

  const role = user.unsafeMetadata?.role as string;
  if (role !== "teacher" && role !== "admin") throw new Error("غير مصرح");

  const levelId = formData.get("levelId") as string;
  const subject = formData.get("subject") as string;
  const announcementId = formData.get("announcementId") as string;

  const data = await getAnnouncements(levelId);
  if (data[subject]) {
    data[subject] = data[subject].filter((a) => a.id !== announcementId);
    await saveAnnouncements(levelId, data);
  }

  revalidatePath(`/dashboard/teacher/class/${levelId}`);
  revalidatePath(`/dashboard/student/homework`);
}
