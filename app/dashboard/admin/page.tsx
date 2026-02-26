import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateUserRole, deleteUser, updateStudentLevel, updateTeacherDepartment } from "./actions";
import { LEVELS, ARABIC_LEVELS, ISLAMIC_LEVELS } from "@/lib/program-data";
import { type AuditEntry } from "@/lib/audit-log";
import { RoleSelect } from "./RoleSelect";

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

  // Aggregate in-site audit log from all users' metadata
  const auditLog: AuditEntry[] = [];
  for (const u of users) {
    const log = (u.unsafeMetadata?.actionLog as AuditEntry[] | undefined) ?? [];
    auditLog.push(...log);
  }
  auditLog.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const recentLog = auditLog.slice(0, 50);

  // Fetch recent GitHub commits (code changes)
  type GitCommit = {
    sha: string;
    commit: {
      message: string;
      author: { name: string; date: string };
    };
    html_url: string;
  };
  let commits: GitCommit[] = [];
  try {
    const headers: Record<string, string> = { "User-Agent": "wafi-admin" };
    if (process.env.GITHUB_TOKEN) headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(
      "https://api.github.com/repos/bluu0620/alwafi.github.io/commits?per_page=30",
      { headers, next: { revalidate: 60 } }
    );
    if (res.ok) commits = await res.json();
  } catch {
    // GitHub API unavailable — skip silently
  }

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
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40">تاريخ الإنشاء</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40">الدور</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40">القسم / المستوى</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40 rounded-l-xl">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const role = (u.unsafeMetadata?.role as string) || "none";
                  const level = (u.unsafeMetadata?.level as string) || "";
                  const levelData = level ? LEVELS[level] : null;
                  const department = (u.unsafeMetadata?.department as string) || "";
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

                      {/* Role — dropdown or badge for admin */}
                      <td className="p-4 text-center">
                        {role !== "admin" ? (
                          <RoleSelect
                            currentRole={role}
                            currentDepartment={department}
                            action={async (formData: FormData) => {
                              "use server";
                              const combined = formData.get("combined") as string;
                              const [newRole, newDept] = combined.includes(":")
                                ? combined.split(":")
                                : [combined, ""];
                              await updateUserRole(u.id, newRole);
                              if (newRole === "teacher") {
                                await updateTeacherDepartment(u.id, newDept);
                              }
                            }}
                          />
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${ROLE_COLORS.admin}`}>
                            مدير
                          </span>
                        )}
                      </td>

                      {/* Level / Department */}
                      <td className="p-4 text-center">
                        {role === "teacher" ? (
                          <div className="flex flex-col items-center gap-2">
                            {department ? (
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold border ${
                                department === "language"
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                              }`}>
                                {department === "language" ? "لغوي" : "شرعي"}
                              </span>
                            ) : (
                              <span className="text-xs text-purple-300/40">غير محدد</span>
                            )}
                            <form
                              action={async (formData: FormData) => {
                                "use server";
                                const newDept = formData.get("department") as string;
                                await updateTeacherDepartment(u.id, newDept);
                              }}
                              className="flex items-center gap-1"
                            >
                              <select
                                name="department"
                                defaultValue={department}
                                className="h-7 text-xs bg-purple-900/60 border border-purple-700/40 text-purple-300 rounded-lg px-2 focus:outline-none focus:border-amber-500/50"
                              >
                                <option value="">— بدون قسم —</option>
                                <option value="language">لغوي</option>
                                <option value="sharia">شرعي</option>
                              </select>
                              <button
                                type="submit"
                                className="h-7 px-2.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/30 transition"
                              >
                                حفظ
                              </button>
                            </form>
                          </div>
                        ) : role === "student" ? (
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
                                className="h-7 text-xs bg-purple-900/60 border border-purple-700/40 text-purple-300 rounded-lg px-2 focus:outline-none focus:border-amber-500/50 max-w-[120px]"
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
                                className="h-7 px-2.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/30 transition"
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
                        <div className="flex items-center gap-1.5 flex-wrap justify-center">
                          <Link
                            href={`/dashboard/profile/${u.id}`}
                            className="h-7 px-2.5 flex items-center rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/30 transition"
                          >
                            ملف
                          </Link>
                          {role === "student" && level && (
                            <Link
                              href={`/dashboard/admin/preview/${level}`}
                              className="h-7 px-2.5 flex items-center rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition"
                            >
                              عرض
                            </Link>
                          )}
                          {role === "teacher" && (
                            <Link
                              href="/dashboard/teacher"
                              className="h-7 px-2.5 flex items-center rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition"
                            >
                              عرض
                            </Link>
                          )}
                          {role === "graduate" && (
                            <Link
                              href="/dashboard/graduate"
                              className="h-7 px-2.5 flex items-center rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition"
                            >
                              عرض
                            </Link>
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
                                className="h-7 px-2.5 rounded-lg bg-red-900/30 border border-red-800/40 text-red-500 text-xs hover:bg-red-900/50 transition"
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

        {/* Channel Log */}
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg">🗒️</span>
            <div>
              <h2 className="text-xl font-bold text-amber-400">Channel Log</h2>
              <p className="text-xs text-purple-300/40">Code changes and in-site activity — most recent first</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Code Changes — GitHub commits */}
            <div className="bg-[#0d1117] rounded-2xl border border-blue-500/20 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-500/10">
                <span className="text-lg">💻</span>
                <h3 className="font-bold text-blue-400 text-sm uppercase tracking-widest">Code Changes</h3>
                <span className="mr-auto px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400/60 text-xs">GitHub</span>
              </div>
              {commits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-purple-300/30 text-xs">No commits fetched</p>
                </div>
              ) : (
                <div className="space-y-1 font-mono text-xs">
                  {commits.map((c) => {
                    const msg = c.commit.message.split("\n")[0];
                    const date = new Date(c.commit.author.date);
                    const dateStr = date.toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "2-digit",
                    });
                    const timeStr = date.toLocaleTimeString("en-GB", {
                      hour: "2-digit", minute: "2-digit",
                    });
                    const sha = c.sha.slice(0, 7);
                    return (
                      <a
                        key={c.sha}
                        href={c.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-blue-500/5 transition-colors group"
                      >
                        <span className="text-blue-500/40 shrink-0 mt-0.5">{sha}</span>
                        <span className="text-white/70 flex-1 leading-snug group-hover:text-white transition-colors">{msg}</span>
                        <span className="text-purple-300/25 shrink-0 text-right leading-snug" dir="ltr">
                          {dateStr}<br />{timeStr}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* In-Site Changes — audit log */}
            <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-500/10">
                <span className="text-lg">⚙️</span>
                <h3 className="font-bold text-amber-400 text-sm uppercase tracking-widest">In-Site Changes</h3>
                <span className="mr-auto px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400/60 text-xs">Admin actions</span>
              </div>
              {recentLog.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-purple-300/30 text-xs">No activity logged yet</p>
                </div>
              ) : (
                <div className="space-y-1 font-mono text-xs">
                  {recentLog.map((entry) => {
                    const date = new Date(entry.timestamp);
                    const dateStr = date.toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "2-digit",
                    });
                    const timeStr = date.toLocaleTimeString("en-GB", {
                      hour: "2-digit", minute: "2-digit",
                    });
                    const actionColor: Record<string, string> = {
                      "Role Changed": "text-amber-400",
                      "Level Assigned": "text-blue-400",
                      "Dept Assigned": "text-cyan-400",
                      "User Deleted": "text-red-400",
                      "Fine Issued": "text-orange-400",
                      "Fine Removed": "text-green-400",
                    };
                    const color = actionColor[entry.action] ?? "text-purple-300";
                    return (
                      <div
                        key={entry.id}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-purple-900/30 transition-colors group"
                      >
                        <span className={`font-bold shrink-0 mt-0.5 ${color}`}>[{entry.action.split(" ")[0]}]</span>
                        <span className="text-white/70 flex-1 leading-snug">{entry.details}</span>
                        <div className="text-right shrink-0 leading-snug">
                          <p className="text-purple-300/25" dir="ltr">{dateStr}<br />{timeStr}</p>
                          <p className="text-purple-300/20 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                            {entry.performedBy}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

