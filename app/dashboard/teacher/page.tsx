import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LEVELS } from "@/lib/program-data";

export default async function TeacherDashboard() {
  const user = await currentUser();
  if (!user) redirect("/");

  const role = user.unsafeMetadata?.role as string | undefined;
  if (role !== "teacher" && role !== "admin" && role !== "dev") redirect("/dashboard");

  // Load real student counts per level
  const client = await clerkClient();
  const { data: allUsers } = await client.users.getUserList({ limit: 200 });
  const students = allUsers.filter((u) => u.unsafeMetadata?.role === "student");

  const deptLevels = Object.values(LEVELS);

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-l from-amber-400 to-amber-300 bg-clip-text text-transparent">
                مرحباً، {user.firstName || "معلم"}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-purple-300/60">لوحة تحكم المعلم - برنامج الوافي</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fines Banner */}
        <div className="mb-6 bg-red-900/20 rounded-2xl border border-red-500/20 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl shrink-0">
              ⚠️
            </div>
            <div>
              <p className="font-bold text-white text-lg">الغرامات</p>
              <p className="text-sm text-purple-300/60">سجل غرامات على الطلاب لمخالفة قواعد البرنامج</p>
            </div>
          </div>
          <Link
            href="/dashboard/fines"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-l from-red-500 to-red-600 text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-red-500/20"
          >
            سجل غرامة
          </Link>
        </div>

        {/* Classes */}
        <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📚</span>
            الفصول الدراسية
          </h2>

          {deptLevels.length === 0 ? (
            <p className="text-purple-300/40 text-sm text-center py-8">
              لم يتم تحديد القسم بعد — تواصل مع المدير
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptLevels.map((lvl) => {
                const count = students.filter(
                  (s) => s.unsafeMetadata?.level === lvl.id
                ).length;

                // Count total submissions across all subjects for this level
                const totalSubmissions = students
                  .filter((s) => s.unsafeMetadata?.level === lvl.id)
                  .reduce((acc, s) => {
                    const hw = (s.unsafeMetadata?.homework as Record<string, unknown[]>) ?? {};
                    return acc + Object.values(hw).reduce((a, v) => a + v.length, 0);
                  }, 0);

                return (
                  <Link
                    key={lvl.id}
                    href={`/dashboard/teacher/class/${lvl.id}`}
                    className="group bg-purple-900/30 rounded-2xl p-6 border border-amber-500/10 hover:border-amber-500/30 hover:bg-purple-900/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        🎓
                      </div>
                      {totalSubmissions > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold">
                          {totalSubmissions} واجب
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1">{lvl.name}</h3>
                    {lvl.leader && (
                      <p className="text-purple-300/50 text-xs mb-3">{lvl.leader}</p>
                    )}
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        👨‍🎓 {count} طالب
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-800/40 border border-purple-700/30 text-purple-300/60">
                        📖 {lvl.subjects.length} مواد
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
