import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateUserRole, deleteUser, updateStudentLevel } from "./actions";
import { LEVELS, ARABIC_LEVELS, ISLAMIC_LEVELS } from "@/lib/program-data";
import { getLevelsConfig, getAllMergedLevels } from "@/lib/level-config";
import { type AuditEntry } from "@/lib/audit-log";
import { removeFineAction, toggleFinePaymentAction } from "@/app/dashboard/fines/actions";
import { FINE_REASONS, type Fine } from "@/app/dashboard/fines/types";
import { RoleSelect } from "./RoleSelect";
import { AutoSaveSelect } from "./AutoSaveSelect";

const ROLE_LABELS: Record<string, string> = {
  dev: "Dev",
  admin: "مدير",
  teacher: "معلم",
  student: "طالب",
  graduate: "خريج",
};

const ROLE_COLORS: Record<string, string> = {
  dev: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
  admin: "bg-red-500/20 border-red-500/40 text-red-400",
  teacher: "bg-amber-500/20 border-amber-500/40 text-amber-400",
  student: "bg-purple-500/20 border-purple-500/40 text-purple-300",
  graduate: "bg-green-500/20 border-green-500/40 text-green-400",
};

const ROLE_ORDER: Record<string, number> = {
  dev: 0, admin: 1, teacher: 2, graduate: 3, student: 4,
};

export default async function AdminDashboard() {
  const user = await currentUser();

  const viewerRole = user?.unsafeMetadata?.role as string;
  if (!user || (viewerRole !== "admin" && viewerRole !== "dev")) {
    redirect("/");
  }
  const isDev = viewerRole === "dev";

  const client = await clerkClient();
  const { data: rawUsers } = await client.users.getUserList({ limit: 100 });
  const users = [...rawUsers].sort((a, b) => {
    const ra = (a.unsafeMetadata?.role as string) || "none";
    const rb = (b.unsafeMetadata?.role as string) || "none";
    return (ROLE_ORDER[ra] ?? 5) - (ROLE_ORDER[rb] ?? 5);
  });
  const levelsConfig = await getLevelsConfig();
  const mergedLevels = getAllMergedLevels(levelsConfig);

  // Aggregate in-site audit log — dev only
  type GitCommit = {
    sha: string;
    commit: { message: string; author: { name: string; date: string } };
    html_url: string;
  };
  let recentLog: AuditEntry[] = [];
  let commits: GitCommit[] = [];

  if (isDev) {
    const auditLog: AuditEntry[] = [];
    for (const u of users) {
      const log = (u.unsafeMetadata?.actionLog as AuditEntry[] | undefined) ?? [];
      auditLog.push(...log);
    }
    auditLog.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    recentLog = auditLog.slice(0, 50);

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

                      {/* Role — dropdown or badge */}
                      <td className="p-4 text-center">
                        {!isSelf && (isDev || (role !== "admin" && role !== "dev")) ? (
                          <RoleSelect
                            currentRole={role}
                            isDev={isDev}
                            action={async (formData: FormData) => {
                              "use server";
                              const newRole = formData.get("combined") as string;
                              await updateUserRole(u.id, newRole);
                            }}
                          />
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${ROLE_COLORS[role] ?? "bg-purple-500/20 border-purple-500/40 text-purple-300"}`}>
                            {ROLE_LABELS[role] ?? role}
                          </span>
                        )}
                      </td>

                      {/* Level */}
                      <td className="p-4 text-center">
                        {role === "teacher" ? (
                          <span className="text-xs text-purple-300/30">—</span>
                        ) : role === "student" ? (
                          <div className="flex items-center gap-2 justify-center">
                            <AutoSaveSelect
                              name="level"
                              defaultValue={level}
                              action={async (formData: FormData) => {
                                "use server";
                                const newLevel = formData.get("level") as string;
                                await updateStudentLevel(u.id, newLevel);
                              }}
                              className="h-7 text-xs bg-purple-900/60 border border-purple-700/40 text-purple-300 rounded-full px-3 pr-7 text-center focus:outline-none focus:border-amber-500/50 max-w-[180px]"
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
                            </AutoSaveSelect>
                            {levelData && (
                              <span className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shrink-0">
                                {levelData.shortName}
                              </span>
                            )}
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
                            className="h-7 px-2.5 flex items-center rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/30 transition"
                          >
                            ملف
                          </Link>
                          {role === "student" && level && (
                            <Link
                              href={`/dashboard/admin/preview/${level}`}
                              className="h-7 px-2.5 flex items-center rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition"
                            >
                              عرض
                            </Link>
                          )}
                          {role === "teacher" && (
                            <Link
                              href="/dashboard/teacher"
                              className="h-7 px-2.5 flex items-center rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition"
                            >
                              عرض
                            </Link>
                          )}
                          {role === "graduate" && (
                            <Link
                              href="/dashboard/graduate"
                              className="h-7 px-2.5 flex items-center rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition"
                            >
                              عرض
                            </Link>
                          )}
                          {!isSelf && (isDev ? role !== "dev" : role !== "admin" && role !== "dev") && (
                            <form
                              action={async () => {
                                "use server";
                                await deleteUser(u.id);
                              }}
                            >
                              <button
                                type="submit"
                                className="h-7 px-2.5 rounded-full bg-red-900/30 border border-red-800/40 text-red-500 text-xs hover:bg-red-900/50 transition"
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

        {/* Level Manager */}
        <div className="mt-8 bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📊</span>
            إدارة المستويات
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(mergedLevels).map((lvl) => {
              const count = users.filter(
                (u) => u.unsafeMetadata?.role === "student" && u.unsafeMetadata?.level === lvl.id
              ).length;
              const isCustomized = !!levelsConfig[lvl.id];
              return (
                <div
                  key={lvl.id}
                  className="bg-purple-900/30 rounded-xl p-4 border border-purple-800/30 hover:border-purple-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">{lvl.name}</p>
                      {lvl.leader && (
                        <p className="text-xs text-purple-300/40 mt-0.5">{lvl.leader}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-amber-400">{count}</p>
                      <p className="text-[10px] text-purple-300/40">طالب</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-purple-300/30">
                      {lvl.subjects.length} مواد
                    </span>
                    {isCustomized && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        معدّل
                      </span>
                    )}
                    <div className="mr-auto flex gap-1.5">
                      <Link
                        href={`/dashboard/admin/preview/${lvl.id}`}
                        className="px-2.5 py-1 rounded-lg bg-purple-800/40 border border-purple-700/30 text-purple-300 text-xs hover:bg-purple-800/60 transition"
                      >
                        عرض
                      </Link>
                      <Link
                        href={`/dashboard/admin/levels/${lvl.id}`}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/25 transition"
                      >
                        تعديل
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fines Manager */}
        {(() => {
          type FineRow = Fine & { studentId: string; studentName: string; levelShort?: string };
          const allFines: FineRow[] = [];
          for (const u of users) {
            if (u.unsafeMetadata?.role !== "student") continue;
            const fines = (u.unsafeMetadata?.fines as Fine[] | undefined) ?? [];
            const name =
              `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
              u.emailAddresses[0]?.emailAddress ||
              "طالب";
            const lvl = u.unsafeMetadata?.level as string | undefined;
            const levelShort = lvl ? LEVELS[lvl]?.shortName : undefined;
            for (const fine of fines) {
              allFines.push({ ...fine, studentId: u.id, studentName: name, levelShort });
            }
          }
          allFines.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
          const unpaidCount = allFines.filter((f) => !f.paid).length;

          return (
            <div className="mt-8 bg-red-900/10 rounded-2xl border border-red-500/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-red-400 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">⚠️</span>
                  إدارة الغرامات
                </h2>
                <div className="flex items-center gap-2">
                  {unpaidCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold">
                      {unpaidCount} غير مدفوعة
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/30 text-purple-300/60 text-sm">
                    {allFines.length} إجمالي
                  </span>
                </div>
              </div>

              {allFines.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">✅</p>
                  <p className="text-purple-300/40 text-sm">لا توجد غرامات مسجلة</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allFines.map((fine) => (
                    <div
                      key={fine.id}
                      className={`rounded-xl border p-4 flex items-center gap-3 transition ${
                        fine.paid
                          ? "bg-green-900/10 border-green-800/20"
                          : "bg-red-900/10 border-red-800/20"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <Link
                            href={`/dashboard/profile/${fine.studentId}`}
                            className="font-bold text-sm text-white hover:text-amber-300 transition"
                          >
                            {fine.studentName}
                          </Link>
                          {fine.levelShort && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                              {fine.levelShort}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-red-400/80">
                          {FINE_REASONS[fine.reason] ?? fine.reason}
                          {fine.reason === "other" && fine.otherNote && (
                            <span className="text-purple-300/50"> — {fine.otherNote}</span>
                          )}
                        </p>
                        <p className="text-xs text-purple-300/40 mt-0.5">
                          بواسطة: {fine.issuedByName} ·{" "}
                          {new Date(fine.issuedAt).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <form action={toggleFinePaymentAction}>
                          <input type="hidden" name="studentId" value={fine.studentId} />
                          <input type="hidden" name="fineId" value={fine.id} />
                          <button
                            type="submit"
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                              fine.paid
                                ? "bg-green-900/30 border-green-700/40 text-green-400 hover:bg-green-900/50"
                                : "bg-yellow-900/20 border-yellow-700/30 text-yellow-500 hover:bg-yellow-900/40"
                            }`}
                          >
                            {fine.paid ? "✓ مدفوعة" : "○ غير مدفوعة"}
                          </button>
                        </form>
                        <form action={removeFineAction}>
                          <input type="hidden" name="studentId" value={fine.studentId} />
                          <input type="hidden" name="fineId" value={fine.id} />
                          <button
                            type="submit"
                            className="px-2.5 py-1.5 rounded-lg bg-red-900/30 border border-red-800/40 text-red-500 text-xs hover:bg-red-900/50 transition"
                          >
                            حذف
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Channel Log — dev only */}
        {isDev && <div className="mt-8">
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
        </div>}

      </div>
    </div>
  );
}

