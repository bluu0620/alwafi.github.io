import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LEVELS } from "@/lib/program-data";
import { getLevelsConfig, mergeLevel } from "@/lib/level-config";
import { type HomeworkData } from "@/lib/homework-types";
import { getAnnouncements } from "@/lib/announcements";
import { SubmitPanel } from "./SubmitPanel";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function StudentHomeworkPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/");

  const role = user.unsafeMetadata?.role as string | undefined;
  const level = user.unsafeMetadata?.level as string | undefined;
  if (role !== "student" || !level) redirect("/dashboard");

  if (!LEVELS[level]) redirect("/dashboard");
  const levelsConfig = await getLevelsConfig();
  const levelData = mergeLevel(level, levelsConfig);

  const homework = (user.unsafeMetadata?.homework as HomeworkData) ?? {};
  const { subject: activeSubject } = await searchParams;
  const subject = activeSubject ?? levelData.subjects[0]?.name ?? "";

  // Load announcements for this level
  const announcements = await getAnnouncements(level);
  const subjectAnnouncements = announcements[subject] ?? [];

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-l from-amber-400 to-amber-300 bg-clip-text text-transparent">
              الواجبات
            </h1>
            <p className="text-purple-300/60 mt-0.5">
              {levelData.name} · {levelData.subjects.length} مواد
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">

          {/* Subject sidebar */}
          <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-4 h-fit">
            <p className="text-xs font-bold text-purple-300/50 uppercase tracking-wider mb-3 px-1">
              المواد
            </p>
            <div className="space-y-1">
              {levelData.subjects.map((s) => {
                const count = homework[s.name]?.length ?? 0;
                const hasAnnouncement = (announcements[s.name]?.length ?? 0) > 0;
                const isActive = s.name === subject;
                return (
                  <Link
                    key={s.name}
                    href={`/dashboard/student/homework?subject=${encodeURIComponent(s.name)}`}
                    className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition ${
                      isActive
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                        : "hover:bg-purple-900/40 text-purple-300/70 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <span className="font-medium">{s.name}</span>
                      {hasAnnouncement && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="يوجد إعلان" />
                      )}
                    </span>
                    {count > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Subject content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">
                {levelData.subjects.find((s) => s.name === subject)?.icon}
              </span>
              <h2 className="text-xl font-bold text-white">{subject}</h2>
            </div>

            {/* Teacher announcements */}
            {subjectAnnouncements.length > 0 && (
              <div className="mb-5 bg-amber-900/10 rounded-2xl border border-amber-500/20 p-4 space-y-3">
                <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  📢 إعلانات المعلم
                </p>
                {subjectAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
                  >
                    <p className="text-sm text-white leading-relaxed">{ann.text}</p>
                    <p className="text-xs text-purple-300/40 mt-1.5">
                      {ann.teacherName} · {formatDate(ann.postedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <SubmitPanel
              subject={subject}
              existingSubmissions={homework[subject] ?? []}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
