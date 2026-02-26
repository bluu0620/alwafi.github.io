import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { addFineAction } from "./actions";
import { FINE_REASONS, type Fine } from "./types";
import { LEVELS } from "@/lib/program-data";

export default async function FinesPage() {
  const viewer = await currentUser();
  if (!viewer) redirect("/");

  const viewerRole = viewer.unsafeMetadata?.role as string | undefined;
  if (viewerRole !== "teacher" && viewerRole !== "graduate" && viewerRole !== "admin") {
    redirect("/dashboard");
  }

  const client = await clerkClient();
  const { data: allUsers } = await client.users.getUserList({ limit: 200 });

  const students = allUsers.filter(
    (u) => u.unsafeMetadata?.role === "student"
  );

  // Aggregate all fines across students for the recent log
  type FineWithStudent = Fine & { studentId: string; studentName: string };
  const recentFines: FineWithStudent[] = [];
  for (const student of students) {
    const fines = (student.unsafeMetadata?.fines as Fine[] | undefined) ?? [];
    const name =
      `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
      student.emailAddresses[0]?.emailAddress ||
      "طالب";
    for (const fine of fines) {
      recentFines.push({ ...fine, studentId: student.id, studentName: name });
    }
  }
  recentFines.sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  );

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-l from-red-400 to-amber-400 bg-clip-text text-transparent">
                الغرامات
              </h1>
              <p className="text-purple-300/60">تسجيل ومتابعة غرامات الطلاب</p>
            </div>
          </div>
        </div>

        {/* Add Fine Form */}
        <div className="bg-red-900/10 rounded-2xl border border-red-500/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              📝
            </span>
            سجل غرامة
          </h2>

          <form action={addFineAction} className="grid sm:grid-cols-3 gap-4">
            {/* Student selector */}
            <div>
              <label className="text-xs text-purple-300/60 mb-1.5 block">اسم الطالب</label>
              <select
                name="studentId"
                required
                className="w-full text-sm bg-purple-900/60 border border-purple-700/40 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500/50"
              >
                <option value="">— اختر الطالب —</option>
                {students.map((s) => {
                  const sName =
                    `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() ||
                    s.emailAddresses[0]?.emailAddress ||
                    "طالب";
                  const level = s.unsafeMetadata?.level as string | undefined;
                  const levelData = level ? LEVELS[level] : null;
                  return (
                    <option key={s.id} value={s.id}>
                      {sName}
                      {levelData ? ` — ${levelData.shortName}` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Reason selector */}
            <div>
              <label className="text-xs text-purple-300/60 mb-1.5 block">نوع الغرامة</label>
              <select
                name="reason"
                required
                className="w-full text-sm bg-purple-900/60 border border-purple-700/40 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500/50"
              >
                <option value="">— اختر السبب —</option>
                <option value="phone">استخدام الهاتف في الوافي</option>
                <option value="language">التحدث بغير العربية</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            {/* Other note */}
            <div>
              <label className="text-xs text-purple-300/60 mb-1.5 block">
                ملاحظة <span className="opacity-50">(للسبب الآخر)</span>
              </label>
              <input
                name="otherNote"
                type="text"
                placeholder="اذكر السبب..."
                className="w-full text-sm bg-purple-900/60 border border-purple-700/40 text-white placeholder-purple-400/40 rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-l from-red-500 to-red-600 text-white font-bold hover:opacity-90 transition shadow-lg shadow-red-500/20"
              >
                تسجيل الغرامة
              </button>
            </div>
          </form>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Students with fine counts */}
          <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                👥
              </span>
              الطلاب
            </h2>
            {students.length === 0 ? (
              <p className="text-purple-300/40 text-sm text-center py-8">لا يوجد طلاب مسجلون</p>
            ) : (
              <div className="space-y-2">
                {students
                  .sort((a, b) => {
                    const fa = ((a.unsafeMetadata?.fines as Fine[] | undefined) ?? []).length;
                    const fb = ((b.unsafeMetadata?.fines as Fine[] | undefined) ?? []).length;
                    return fb - fa;
                  })
                  .map((s) => {
                    const sName =
                      `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() ||
                      s.emailAddresses[0]?.emailAddress ||
                      "طالب";
                    const sInitials =
                      (
                        (s.firstName?.[0] ?? "") + (s.lastName?.[0] ?? "")
                      ).toUpperCase() || "؟";
                    const level = s.unsafeMetadata?.level as string | undefined;
                    const levelData = level ? LEVELS[level] : null;
                    const fineCount = (
                      (s.unsafeMetadata?.fines as Fine[] | undefined) ?? []
                    ).length;

                    return (
                      <Link
                        key={s.id}
                        href={`/dashboard/profile/${s.id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-purple-900/30 border border-purple-800/30 hover:border-amber-500/30 hover:bg-purple-900/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                            {sInitials}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm group-hover:text-amber-300 transition-colors">
                              {sName}
                            </p>
                            {levelData && (
                              <p className="text-xs text-purple-300/50">{levelData.shortName}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {fineCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
                              {fineCount} غرامة
                            </span>
                          )}
                          <span className="text-purple-300/30 text-xs">←</span>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Recent Fines Log */}
          <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                📋
              </span>
              آخر الغرامات
            </h2>
            {recentFines.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-purple-300/40 text-sm">لا توجد غرامات مسجلة</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFines.slice(0, 15).map((fine) => (
                  <Link
                    key={fine.id}
                    href={`/dashboard/profile/${fine.studentId}`}
                    className="block bg-red-900/10 rounded-xl border border-red-500/15 p-4 hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-white text-sm">{fine.studentName}</p>
                        <p className="text-xs text-red-400/80 mt-0.5">
                          {FINE_REASONS[fine.reason] ?? fine.reason}
                          {fine.reason === "other" && fine.otherNote && (
                            <span className="text-purple-300/50"> — {fine.otherNote}</span>
                          )}
                        </p>
                      </div>
                      <p className="text-xs text-purple-300/40 shrink-0" dir="ltr">
                        {new Date(fine.issuedAt).toLocaleDateString("ar-SA", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="text-xs text-purple-300/40 mt-1">بواسطة: {fine.issuedByName}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
