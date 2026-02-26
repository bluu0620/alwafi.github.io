import { put, list } from "@vercel/blob";

export interface Announcement {
  id: string;
  text: string;
  postedAt: string;
  teacherName: string;
}

export type AnnouncementsData = Record<string, Announcement[]>;

export async function getAnnouncements(levelId: string): Promise<AnnouncementsData> {
  const pathname = `announcements/${levelId}.json`;
  try {
    const { blobs } = await list({ prefix: pathname });
    const blob = blobs.find((b) => b.pathname === pathname);
    if (!blob) return {};
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function saveAnnouncements(
  levelId: string,
  data: AnnouncementsData
): Promise<void> {
  const pathname = `announcements/${levelId}.json`;
  await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}
