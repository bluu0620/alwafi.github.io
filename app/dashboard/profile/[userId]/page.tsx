import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LEVELS } from "@/lib/program-data";
import { addFineAction, removeFineAction, FINE_REASONS, type Fine } from "@/app/dashboard/fines/actions";
import Link from "next/link";

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

const ROLE_ICONS: Record<string, string> = {
  admin: "🛡️",
  teacher: "👨‍🏫",
  student: "🎒",
  graduate: "🎓",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const viewer = await currentUser();
  if (!viewer) redirect("/");

  const { userId } = await params;

  const client = await clerkClient();
  let profileUser;
  try {
    profileUser = await client.users.getUser(userId);
  } catch {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-white mb-2">المستخدم غير موجود</h1>
          <p className="text-purple-300/60 mb-6">لم يتم العثور على هذا الحساب في النظام</p>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-medium hover:bg-amber-500/30 transition"
          >
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  const viewerRole = viewer.unsafeMetadata?.role as string | undefined;
  const profileRole = (profileUser.unsafeMetadata?.role as string) || "none";
  const profileLevel = profileUser.unsafeMetadata?.level as string | undefined;
  const levelData = profileLevel ? LEVELS[profileLevel] : null;
  const fines = (profileUser.unsafeMetadata?.fines as Fine[] | undefined) ?? [];

  const isSelf = viewer.id === userId;
  const canIssueFines =
    profileRole === "student" &&
    (viewerRole === "teacher" || viewerRole === "graduate" || viewerRole === "admin");
  const canDeleteFines = viewerRole === "admin";

  const name =
    `${profileUser.firstName ?? ""} ${profileUser.lastName ?? ""}`.trim() ||
    profileUser.emailAddresses[0]?.emailAddress ||
    "مستخدم";
  const email = profileUser.emailAddresses[0]?.emailAddress || "—";
  const initials =
    ((profileUser.firstName?.[0] ?? "") + (profileUser.lastName?.[0] ?? "")).toUpperCase() ||
    email[0]?.toUpperCase() ||
    "؟";
  const joinDate = new Date(profileUser.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-purple-300/60 hover:text-amber-400 transition-colors"
          >
            ← العودة للوحة التحكم
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-500/30 flex items-center justify-center text-3xl font-bold text-amber-400 shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-white">{name}</h1>
                {isSelf && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
                    أنت
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                    ROLE_COLORS[profileRole] ??
                    "bg-purple-900/40 border-purple-700 text-purple-400"
                  }`}
                >
                  <span>{ROLE_ICONS[profileRole] ?? "👤"}</span>
                  {ROLE_LABELS[profileRole] ?? "غير محدد"}
                </span>
                {levelData && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    📚 {levelData.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-800/30">
              <p className="text-purple-300/50 text-xs mb-1">البريد الإلكتروني</p>
              <p className="text-white font-medium" dir="ltr">{email}</p>
            </div>
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-800/30">
              <p className="text-purple-300/50 text-xs mb-1">تاريخ الانضمام</p>
              <p className="text-white font-medium">{joinDate}</p>
            </div>
            {levelData && (
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-800/30">
                <p className="text-purple-300/50 text-xs mb-1">القسم</p>
                <p className="text-white font-medium">
                  {levelData.department === "arabic" ? "قسم اللغة العربية" : "القسم الشرعي"}
                </p>
              </div>
            )}
            {levelData && levelData.leader && (
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-800/30">
                <p className="text-purple-300/50 text-xs mb-1">مسؤول المستوى</p>
                <p className="text-white font-medium">{levelData.leader}</p>
              </div>
            )}
          </div>
        </div>

        {/* Fines Section — only for students */}
        {profileRole === "student" && (
          <div className="bg-purple-900/20 rounded-2xl border border-red-500/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-bold text-red-400 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  ⚠️
                </span>
                الغرامات
                {fines.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold">
                    {fines.length}
                  </span>
                )}
              </h2>
            </div>

            {/* Add Fine Form — for teachers, graduates, admins */}
            {canIssueFines && (
              <form
                action={addFineAction}
                className="bg-red-900/10 rounded-xl border border-red-500/20 p-5 mb-6"
              >
                <input type="hidden" name="studentId" value={userId} />
                <p className="text-sm font-bold text-red-400 mb-4">سجل غرامة جديدة</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
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
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-red-500 to-red-600 text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-red-500/20"
                >
                  تسجيل الغرامة
                </button>
              </form>
            )}

            {/* Fines List */}
            {fines.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-purple-300/60 text-sm">لا توجد غرامات مسجلة</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fines
                  .slice()
                  .reverse()
                  .map((fine) => (
                    <div
                      key={fine.id}
                      className="bg-red-900/10 rounded-xl border border-red-500/20 p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-sm text-white">
                            {FINE_REASONS[fine.reason] ?? fine.reason}
                          </span>
                          {fine.reason === "other" && fine.otherNote && (
                            <span className="text-xs text-purple-300/60">— {fine.otherNote}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-purple-300/50">
                          <span>بواسطة: {fine.issuedByName}</span>
                          <span>•</span>
                          <span dir="ltr">
                            {new Date(fine.issuedAt).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      {canDeleteFines && (
                        <form action={removeFineAction}>
                          <input type="hidden" name="studentId" value={userId} />
                          <input type="hidden" name="fineId" value={fine.id} />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-800/40 text-red-400 text-xs hover:bg-red-900/60 transition shrink-0"
                          >
                            حذف
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Admin quick actions */}
        {viewerRole === "admin" && !isSelf && (
          <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-5">
            <p className="text-sm font-bold text-amber-400 mb-3">إجراءات الإدارة</p>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition"
            >
              ← إدارة المستخدمين
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
