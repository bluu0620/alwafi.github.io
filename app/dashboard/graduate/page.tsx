import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FRIDAY_SCHEDULE,
  SATURDAY_SCHEDULE,
  ACADEMIC_CALENDAR,
  EVENT_TYPE_STYLES,
  PROGRAM_INFO,
} from "@/lib/program-data";

function getEventStatus(gregorian: string): "past" | "today" | "soon" | "upcoming" {
  const today = new Date("2026-02-26");
  const eventDate = new Date(gregorian);
  const diffDays = Math.floor(
    (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0) return "past";
  if (diffDays === 0) return "today";
  if (diffDays <= 14) return "soon";
  return "upcoming";
}

function formatGregorianAr(gregorian: string) {
  const [y, m, d] = gregorian.split("-");
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

export default async function GraduateDashboard() {
  const user = await currentUser();

  if (!user) redirect("/");
  if (user.unsafeMetadata?.role !== "graduate") redirect("/dashboard");

  const upcomingEvents = ACADEMIC_CALENDAR.filter(
    (e) => e.type !== "study" && getEventStatus(e.gregorian) !== "past"
  ).slice(0, 6);

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-l from-green-400 to-emerald-300 bg-clip-text text-transparent">
                مرحباً، {user.firstName || "خريج"}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-purple-300/60">
                  {PROGRAM_INFO.name} — {PROGRAM_INFO.semester} {PROGRAM_INFO.hijriYear}
                </p>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold border bg-green-500/10 border-green-500/30 text-green-400">
                  خريج
                </span>
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
              <p className="text-sm text-purple-300/60">
                يمكنك تسجيل غرامات على الطلاب لمخالفة قواعد البرنامج
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/fines"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-l from-red-500 to-red-600 text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-red-500/20"
          >
            سجل غرامة
          </Link>
        </div>

        {/* Schedule Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <ScheduleCard title="جدول يوم الجمعة" icon="📅" slots={FRIDAY_SCHEDULE} />
          <ScheduleCard title="جدول يوم السبت" icon="📅" slots={SATURDAY_SCHEDULE} />
        </div>

        {/* Academic Calendar */}
        <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              🗓️
            </span>
            التقويم الدراسي — الفصل الثاني {PROGRAM_INFO.hijriYear}
          </h2>
          <p className="text-sm text-purple-300/50 mb-6 mr-13">
            تاريخ اعتماد الجدول: {PROGRAM_INFO.approvalDate}
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-6">
            {(["exam_first", "exam_second", "final_exam", "break", "ceremony"] as const).map(
              (type) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${EVENT_TYPE_STYLES[type].dot}`} />
                  <span className="text-xs text-purple-300/60">
                    {EVENT_TYPE_STYLES[type].label}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Upcoming important events */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-purple-300/60 uppercase tracking-wider mb-3">
              المواعيد القادمة
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingEvents.map((event) => {
                const status = getEventStatus(event.gregorian);
                const style = EVENT_TYPE_STYLES[event.type];
                return (
                  <div
                    key={event.gregorian}
                    className={`rounded-xl p-4 border ${style.classes} ${
                      status === "soon" ? "ring-1 ring-amber-500/40" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-bold text-sm">{event.note}</p>
                      {status === "soon" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0">
                          قريباً
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-70">
                      {event.dayAr} — {formatGregorianAr(event.gregorian)}
                    </p>
                    <p className="text-xs opacity-50 mt-0.5">
                      {event.hijri.replace(/-/g, "/")} هـ
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full calendar table */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-bold text-amber-400/70 hover:text-amber-400 transition-colors list-none flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              عرض التقويم الكامل
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-3 text-right font-bold text-amber-400/70 bg-purple-900/40 rounded-r-xl">
                      اليوم
                    </th>
                    <th className="p-3 text-right font-bold text-amber-400/70 bg-purple-900/40">
                      التاريخ الميلادي
                    </th>
                    <th className="p-3 text-right font-bold text-amber-400/70 bg-purple-900/40">
                      التاريخ الهجري
                    </th>
                    <th className="p-3 text-right font-bold text-amber-400/70 bg-purple-900/40 rounded-l-xl">
                      الملاحظة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ACADEMIC_CALENDAR.map((event) => {
                    const style = EVENT_TYPE_STYLES[event.type];
                    return (
                      <tr
                        key={event.gregorian}
                        className="border-b border-purple-800/30 hover:bg-purple-900/30 transition"
                      >
                        <td className="p-3 text-white font-medium">{event.dayAr}</td>
                        <td className="p-3 text-purple-300/70" dir="ltr">
                          {event.gregorian.split("-").reverse().join("-")}
                        </td>
                        <td className="p-3 text-purple-300/70" dir="ltr">
                          {event.hijri.split("-").reverse().join("-")}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${style.classes}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {event.note}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>

          {/* Special Activities */}
          <div className="mt-6 pt-6 border-t border-purple-800/30">
            <h3 className="text-sm font-bold text-purple-300/60 mb-3">
              الأنشطة والفعاليات الخاصة (ضمن الفصل الثاني)
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "مسابقة الأندية",
                "عمرة الوافي",
                "المخيم الشرعي",
                "المخيم اللغوي",
                "إجازة عيد الأضحى",
              ].map((act) => (
                <span
                  key={act}
                  className="px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-700/30 text-purple-300/70 text-sm"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ScheduleCard({
  title,
  icon,
  slots,
}: {
  title: string;
  icon: string;
  slots: typeof FRIDAY_SCHEDULE;
}) {
  return (
    <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
      <h2 className="text-xl font-bold text-amber-400 mb-5 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          {icon}
        </span>
        {title}
      </h2>
      <div className="space-y-2">
        {slots.map((slot, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between rounded-xl px-4 py-3 ${
              slot.isBreak
                ? "bg-green-900/20 border border-green-700/30"
                : "bg-purple-900/30 border border-purple-800/30"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                slot.isBreak ? "text-green-400" : "text-white"
              }`}
            >
              {slot.label}
            </span>
            <span className="text-sm font-mono text-purple-300/60" dir="ltr">
              {slot.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
