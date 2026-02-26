import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateUserRole, deleteUser } from "./actions";

const ROLE_LABELS: Record<string, string> = {
  admin: "مدير",
  teacher: "معلم",
  student: "طالب",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/20 border-red-500/40 text-red-400",
  teacher: "bg-amber-500/20 border-amber-500/40 text-amber-400",
  student: "bg-purple-500/20 border-purple-500/40 text-purple-300",
};

export default async function AdminDashboard() {
  const user = await currentUser();

  if (!user || user.unsafeMetadata?.role !== "admin") {
    redirect("/");
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100 });

  const counts = users.reduce(
    (acc, u) => {
      const role = (u.unsafeMetadata?.role as string) || "none";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="👥" label="إجمالي الحسابات" value={String(users.length)} />
          <StatCard icon="🛡️" label="المدراء" value={String(counts["admin"] || 0)} color="red" />
          <StatCard icon="👨‍🏫" label="المعلمون" value={String(counts["teacher"] || 0)} color="amber" />
          <StatCard icon="🎓" label="الطلاب" value={String(counts["student"] || 0)} color="purple" />
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
                  <th className="p-4 text-right font-bold text-amber-400/70 bg-purple-900/40">البريد الإلكتروني</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40">الدور</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40">تاريخ الإنشاء</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40 rounded-l-xl">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const role = (u.unsafeMetadata?.role as string) || "none";
                  const initials = ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")) || u.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || "؟";
                  const email = u.emailAddresses[0]?.emailAddress || "-";
                  const createdAt = new Date(u.createdAt).toLocaleDateString("en-GB");
                  const isSelf = u.id === user.id;

                  return (
                    <tr key={u.id} className={`border-b border-purple-800/30 hover:bg-purple-900/30 transition ${isSelf ? "bg-amber-500/5" : ""}`}>
                      {/* User */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {u.firstName || ""} {u.lastName || ""}
                              {isSelf && <span className="mr-2 text-xs text-amber-400/70">(أنت)</span>}
                            </p>
                            <p className="text-xs text-purple-400/50">{u.id.slice(0, 16)}...</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-purple-300/60 text-left" dir="ltr">{email}</td>

                      {/* Role Badge */}
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${ROLE_COLORS[role] || "bg-purple-900/40 border-purple-700 text-purple-400"}`}>
                          {ROLE_LABELS[role] || "غير محدد"}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="p-4 text-center text-purple-300/60 text-xs" dir="ltr">{createdAt}</td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {role !== "student" && (
                            <form action={async () => { "use server"; await updateUserRole(u.id, "student"); }}>
                              <button type="submit" className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/30 transition">
                                طالب
                              </button>
                            </form>
                          )}
                          {role !== "teacher" && (
                            <form action={async () => { "use server"; await updateUserRole(u.id, "teacher"); }}>
                              <button type="submit" className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/30 transition">
                                معلم
                              </button>
                            </form>
                          )}
                          {role !== "admin" && (
                            <form action={async () => { "use server"; await updateUserRole(u.id, "admin"); }}>
                              <button type="submit" className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition">
                                مدير
                              </button>
                            </form>
                          )}
                          {!isSelf && (
                            <form action={async () => { "use server"; await deleteUser(u.id); }}>
                              <button type="submit" className="px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-800/40 text-red-500 text-xs hover:bg-red-900/50 transition">
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
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color = "default",
}: {
  icon: string;
  label: string;
  value: string;
  color?: "red" | "amber" | "purple" | "default";
}) {
  const borderClass = {
    red: "border-red-500/40 shadow-red-500/10",
    amber: "border-amber-500/40 shadow-amber-500/10",
    purple: "border-purple-500/40",
    default: "border-amber-500/10",
  }[color];

  const textClass = {
    red: "text-red-400",
    amber: "text-amber-400",
    purple: "text-purple-300",
    default: "text-white",
  }[color];

  return (
    <div className={`bg-purple-900/20 rounded-2xl p-5 border hover-lift ${borderClass}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
          <p className="text-sm text-purple-300/60">{label}</p>
        </div>
      </div>
    </div>
  );
}
