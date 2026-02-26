import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateUserRole, deleteUser, updateStudentLevel } from "./actions";
import { LEVELS, ARABIC_LEVELS, ISLAMIC_LEVELS } from "@/lib/program-data";

const ROLE_LABELS: Record<string, string> = {
  admin: "مدير",
  teacher: "معلم",
  student: "طالب",
  graduate: "خريج",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/20 border-red-500/40 text-red-400",
  teacher: "bg-amber-500/20 border-amber-500/40 text-amber-400",
  student: "bg-purple-500/20 border-purple-500/40 text-purple-300",
  graduate: "bg-green-500/20 border-green-500/40 text-green-400",
};

export default async function AdminDashboard() {
  const user = await currentUser();

  if (!user || user.unsafeMetadata?.role !== "admin") {
    redirect("/");
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100 });

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-l from-red-400 to-amber-400 bg-clip-text text-transparent">
                لوحة الإدارة
              </h1>
              <p className="text-purple-300/60">التحكم الكامل في الحسابات - برنامج الوافي</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">👥</span>
            جميع الحسابات
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-4 text-right font-bold text-amber-400/70 bg-purple-900/40 rounded-r-xl">المستخدم</th>
                  <th className="p-4 text-right font-bold text-amber-400/70 bg-purple-900/40">البريد</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40">الدور</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40">المستوى</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40">تاريخ الإنشاء</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40 rounded-l-xl">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const role = (u.unsafeMetadata?.role as string) || "none";
                  const level = (u.unsafeMetadata?.level as string) || "";
                  const levelData = level ? LEVELS[level] : null;
                  const initials =
                    ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")) ||
                    u.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ||
                    "؟";
                  const email = u.emailAddresses[0]?.emailAddress || "-";
                  const createdAt = new Date(u.createdAt).toLocaleDateString("en-GB");
                  const isSelf = u.id === user.id;

                  return (
                    <tr
                      key={u.id}
                      className={`border-b border-purple-800/30 hover:bg-purple-900/30 transition ${isSelf ? "bg-amber-500/5" : ""}`}
                    >
                      {/* User */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {u.firstName || ""} {u.lastName || ""}
                              {isSelf && (
                                <span className="mr-2 text-xs text-amber-400/70">(أنت)</span>
                              )}
                            </p>
                            <p className="text-xs text-purple-400/50">{u.id.slice(0, 16)}...</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-purple-300/60 text-left" dir="ltr">
                        {email}
                      </td>

                      {/* Role Badge */}
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${
                            ROLE_COLORS[role] || "bg-purple-900/40 border-purple-700 text-purple-400"
                          }`}
                        >
                          {ROLE_LABELS[role] || "غير محدد"}
                        </span>
                      </td>

                      {/* Level Badge / Assignment */}
                      <td className="p-4 text-center">
                        {role === "student" ? (
                          <div className="flex flex-col items-center gap-2">
                            {levelData ? (
                              <span className="inline-block px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                                {levelData.shortName}
                              </span>
                            ) : (
                              <span className="text-xs text-purple-300/40">غير محدد</span>
                            )}
                            <form
                              action={async (formData: FormData) => {
                                "use server";
                                const newLevel = formData.get("level") as string;
                                await updateStudentLevel(u.id, newLevel);
                              }}
                              className="flex items-center gap-1"
                            >
                              <select
                                name="level"
                                defaultValue={level}
                                className="text-xs bg-purple-900/60 border border-purple-700/40 text-purple-300 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500/50 max-w-[120px]"
                              >
                                <option value="">— بدون مستوى —</option>
                                <optgroup label="قسم اللغة العربية">
                                  {ARABIC_LEVELS.map((lvl) => (
                                    <option key={lvl.id} value={lvl.id}>
                                      {lvl.name}
                                    </option>
                                  ))}
                                </optgroup>
                                <optgroup label="القسم الشرعي">
                                  {ISLAMIC_LEVELS.map((lvl) => (
                                    <option key={lvl.id} value={lvl.id}>
                                      {lvl.name}
                                    </option>
                                  ))}
                                </optgroup>
                              </select>
                              <button
                                type="submit"
                                className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/30 transition"
                              >
                                حفظ
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-xs text-purple-300/30">—</span>
                        )}
                      </td>

                      {/* Created */}
                      <td className="p-4 text-center text-purple-300/60 text-xs" dir="ltr">
                        {createdAt}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Link
                            href={`/dashboard/profile/${u.id}`}
                            className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/30 transition"
                          >
                            ملف
                          </Link>
                          {role === "student" && level && (
                            <Link
                              href={`/dashboard/admin/preview/${level}`}
                              className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition"
                            >
                              عرض
                            </Link>
                          )}
                          {role !== "student" && role !== "admin" && (
                            <form
                              action={async () => {
                                "use server";
                                await updateUserRole(u.id, "student");
                              }}
                            >
                              <button
                                type="submit"
                                className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/30 transition"
                              >
                                طالب
                              </button>
                            </form>
                          )}
                          {role !== "teacher" && role !== "admin" && (
                            <form
                              action={async () => {
                                "use server";
                                await updateUserRole(u.id, "teacher");
                              }}
                            >
                              <button
                                type="submit"
                                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/30 transition"
                              >
                                معلم
                              </button>
                            </form>
                          )}
                          {role !== "graduate" && role !== "admin" && (
                            <form
                              action={async () => {
                                "use server";
                                await updateUserRole(u.id, "graduate");
                              }}
                            >
                              <button
                                type="submit"
                                className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs hover:bg-green-500/30 transition"
                              >
                                خريج
                              </button>
                            </form>
                          )}
                          {role !== "admin" && (
                            <form
                              action={async () => {
                                "use server";
                                await updateUserRole(u.id, "admin");
                              }}
                            >
                              <button
                                type="submit"
                                className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition"
                              >
                                مدير
                              </button>
                            </form>
                          )}
                          {!isSelf && role !== "admin" && (
                            <form
                              action={async () => {
                                "use server";
                                await deleteUser(u.id);
                              }}
                            >
                              <button
                                type="submit"
                                className="px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-800/40 text-red-500 text-xs hover:bg-red-900/50 transition"
                              >
                                حذف
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Level Overview */}
        <div className="mt-8 bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📊</span>
            توزيع الطلاب على المستويات
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.values(LEVELS).map((lvl) => {
              const count = users.filter(
                (u) => u.unsafeMetadata?.level === lvl.id
              ).length;
              return (
                <Link
                  key={lvl.id}
                  href={`/dashboard/admin/preview/${lvl.id}`}
                  className="bg-purple-900/30 rounded-xl p-4 border border-purple-800/30 text-center hover:border-amber-500/30 hover:bg-purple-900/50 transition-colors"
                >
                  <p className="text-2xl font-bold text-amber-400">{count}</p>
                  <p className="text-sm text-white font-medium mt-1">{lvl.name}</p>
                  <p className="text-xs text-purple-300/50 mt-0.5">
                    {lvl.department === "arabic" ? "لغوي" : "شرعي"}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

