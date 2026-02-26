import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { LEVELS } from "@/lib/program-data";
import { getLevelsConfig, mergeLevel } from "@/lib/level-config";
import { type HomeworkData, type Submission } from "@/lib/homework-types";
import { getAnnouncements } from "@/lib/announcements";
import { postAnnouncement, deleteAnnouncement } from "@/app/dashboard/homework/announcement-actions";
import { SubjectFilterPanel } from "./SubjectFilterPanel";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SubmissionBadge({ sub }: { sub: Submission }) {
  const icon = sub.type === "audio" ? "🎙️" : sub.type === "image" ? "🖼️" : "📄";
  return (
    <a
      href={sub.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${sub.filename} · ${formatBytes(sub.size)} · ${formatDate(sub.submittedAt)}`}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-400 text-xs hover:bg-green-900/50 transition"
    >
      {icon}
      <span className="max-w-[120px] truncate">{sub.filename}</span>
    </a>
  );
}

export default async function TeacherClassPage({
  params,
  searchParams,
}: {
  params: Promise<{ levelId: string }>;
  searchParams: Promise<{ subject?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/");

  const role = user.unsafeMetadata?.role as string | undefined;
  if (role !== "teacher" && role !== "admin") redirect("/dashboard");

  const { levelId } = await params;
  if (!LEVELS[levelId]) notFound();
  const levelsConfig = await getLevelsConfig();
  const levelData = mergeLevel(levelId, levelsConfig);

  // Teacher's chosen visible subjects for this level (empty = show all)
  const teacherSubjects = (user.unsafeMetadata?.teacherSubjects as Record<string, string[]> | undefined) ?? {};
  const chosenSubjects = teacherSubjects[levelId];
  const displaySubjects =
    chosenSubjects && chosenSubjects.length > 0
      ? levelData.subjects.filter((s) => chosenSubjects.includes(s.name))
      : levelData.subjects;

  const client = await clerkClient();
  const { data: allUsers } = await client.users.getUserList({ limit: 200 });

  // Students in this level
  const students = allUsers.filter(
    (u) =>
      u.unsafeMetadata?.role === "student" &&
      u.unsafeMetadata?.level === levelId
  );

  const { subject: activeSubject } = await searchParams;
  const subject = activeSubject ?? displaySubjects[0]?.name ?? "";

  // Load announcements for this level
  const announcements = await getAnnouncements(levelId);
  const subjectAnnouncements = announcements[subject] ?? [];

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard/teacher"
            className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700/30 flex items-center justify-center text-purple-300 hover:bg-purple-900/60 transition"
          >
            →
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{levelData.name}</h1>
            <p className="text-purple-300/60 text-sm mt-0.5">
              {levelData.leader && `${levelData.leader} · `}
              {students.length} طالب
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">

          {/* Subject sidebar */}
          <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-4 h-fit">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs font-bold text-purple-300/50 uppercase tracking-wider">
                المواد
              </p>
              <SubjectFilterPanel
                levelId={levelId}
                allSubjects={levelData.subjects}
                chosenSubjects={chosenSubjects ?? []}
              />
            </div>
            <div className="space-y-1">
              {displaySubjects.map((s) => {
                const totalSubmissions = students.reduce((acc, st) => {
                  const hw = (st.unsafeMetadata?.homework as HomeworkData) ?? {};
                  return acc + (hw[s.name]?.length ?? 0);
                }, 0);
                const hasAnnouncement = (announcements[s.name]?.length ?? 0) > 0;
                const isActive = s.name === subject;
                return (
                  <Link
                    key={s.name}
                    href={`/dashboard/teacher/class/${levelId}?subject=${encodeURIComponent(s.name)}`}
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
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      )}
                    </span>
                    {totalSubmissions > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold">
                        {totalSubmissions}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {displaySubjects.find((s) => s.name === subject)?.icon}
              </span>
              <h2 className="text-xl font-bold text-white">{subject}</h2>
            </div>

            {/* Announcements section */}
            <div className="bg-amber-900/10 rounded-2xl border border-amber-500/20 p-5">
              <p className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
                📢 إعلانات المادة
              </p>

              {/* Existing announcements */}
              {subjectAnnouncements.length > 0 && (
                <div className="space-y-2 mb-4">
                  {subjectAnnouncements.map((ann) => (
                    <div
                      key={ann.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white leading-relaxed">{ann.text}</p>
                        <p className="text-xs text-purple-300/40 mt-1">
                          {ann.teacherName} · {formatDate(ann.postedAt)}
                        </p>
                      </div>
                      <form action={deleteAnnouncement}>
                        <input type="hidden" name="levelId" value={levelId} />
                        <input type="hidden" name="subject" value={subject} />
                        <input type="hidden" name="announcementId" value={ann.id} />
                        <button
                          type="submit"
                          className="text-xs text-red-500/50 hover:text-red-400 transition shrink-0"
                        >
                          حذف
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}

              {/* Post new announcement */}
              <form action={postAnnouncement} className="space-y-2">
                <input type="hidden" name="levelId" value={levelId} />
                <input type="hidden" name="subject" value={subject} />
                <textarea
                  name="text"
                  placeholder="اكتب إعلاناً للطلاب في هذه المادة..."
                  rows={2}
                  className="w-full bg-purple-900/30 border border-purple-700/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/40 resize-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition"
                >
                  نشر الإعلان
                </button>
              </form>
            </div>

            {/* Student submissions for selected subject */}
            {students.length === 0 ? (
              <div className="text-center py-16 text-purple-300/30">
                <p className="text-4xl mb-3">👥</p>
                <p>لا يوجد طلاب في هذا المستوى بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((st) => {
                  const hw = (st.unsafeMetadata?.homework as HomeworkData) ?? {};
                  const subs = hw[subject] ?? [];
                  const name =
                    `${st.firstName ?? ""} ${st.lastName ?? ""}`.trim() ||
                    st.emailAddresses[0]?.emailAddress ||
                    "بدون اسم";
                  const initials =
                    ((st.firstName?.[0] ?? "") + (st.lastName?.[0] ?? "")).toUpperCase() ||
                    st.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ||
                    "؟";

                  return (
                    <div
                      key={st.id}
                      className={`rounded-2xl border p-4 transition ${
                        subs.length > 0
                          ? "bg-green-900/10 border-green-500/20"
                          : "bg-purple-900/20 border-purple-800/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{name}</p>
                          <p className="text-xs text-purple-300/40">
                            {subs.length === 0
                              ? "لم يُرسل بعد"
                              : `${subs.length} ملف مُرسل`}
                          </p>
                        </div>
                        {subs.length === 0 ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-900/30 border border-red-800/30 text-red-400">
                            لم يُرسل
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-400">
                            ✓ أرسل
                          </span>
                        )}
                      </div>

                      {subs.length > 0 && (
                        <div className="flex flex-wrap gap-2 pr-12">
                          {subs.map((sub) => (
                            <SubmissionBadge key={sub.id} sub={sub} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
