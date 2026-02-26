import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function getUpcomingFriSat() {
  const today = new Date();
  const dow = today.getDay();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const fmt = (d: Date) => `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  const fri = new Date(today); fri.setDate(today.getDate() + (((5 - dow + 7) % 7) || 7));
  const sat = new Date(today); sat.setDate(today.getDate() + (((6 - dow + 7) % 7) || 7));
  return [
    { day: fmt(fri), periods: ["فيلر", "فيلر", "فيلر", "فيلر", "فيلر"] },
    { day: fmt(sat), periods: ["فيلر", "فيلر", "فيلر", "فيلر", "فيلر"] },
  ];
}

const SAMPLE_TIMETABLE = getUpcomingFriSat();

const SAMPLE_COURSES = [
  { name: "فيلر", teacher: "أ. فلان", grade: 92, icon: "📐" },
  { name: "فيلر", teacher: "أ. فلان", grade: 88, icon: "🔬" },
  { name: "فيلر", teacher: "أ. فلان", grade: 95, icon: "📖" },
  { name: "فيلر", teacher: "أ. فلان", grade: 85, icon: "🌍" },
  { name: "فيلر", teacher: "أ. فلان", grade: 90, icon: "🕌" },
];

const SAMPLE_ANNOUNCEMENTS = [
  { title: "فيلر فيلر فيلر", date: "٢٠٢٥/٠١/٠١", content: "فيلر فيلر فيلر فيلر فيلر فيلر", urgent: true },
  { title: "فيلر فيلر فيلر", date: "٢٠٢٥/٠١/٠١", content: "فيلر فيلر فيلر فيلر فيلر فيلر", urgent: false },
  { title: "فيلر فيلر فيلر", date: "٢٠٢٥/٠١/٠١", content: "فيلر فيلر فيلر فيلر فيلر فيلر", urgent: false },
];

export default async function StudentDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const totalGrade = SAMPLE_COURSES.reduce((acc, c) => acc + c.grade, 0) / SAMPLE_COURSES.length;

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center text-2xl">
              👋
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-l from-amber-400 to-amber-300 bg-clip-text text-transparent">
                مرحباً، {user.firstName || "طالب"}
              </h1>
              <p className="text-purple-300/60">لوحة تحكم الطالب - برنامج الوافي</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickStat icon="📚" label="المواد" value="٥" />
          <QuickStat icon="📊" label="المعدل" value={`${totalGrade.toFixed(0)}%`} highlight />
          <QuickStat icon="📝" label="الواجبات" value="٣" />
          <QuickStat icon="📅" label="الحصص اليوم" value="٥" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Timetable Section */}
          <div className="lg:col-span-2 bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📅</span>
              الجدول الدراسي
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-3 text-right font-bold text-amber-400/70 bg-purple-900/40 rounded-r-xl">اليوم</th>
                    <th className="p-3 text-center font-bold text-amber-400/70 bg-purple-900/40">الحصة ١</th>
                    <th className="p-3 text-center font-bold text-amber-400/70 bg-purple-900/40">الحصة ٢</th>
                    <th className="p-3 text-center font-bold text-amber-400/70 bg-purple-900/40">الحصة ٣</th>
                    <th className="p-3 text-center font-bold text-amber-400/70 bg-purple-900/40">الحصة ٤</th>
                    <th className="p-3 text-center font-bold text-amber-400/70 bg-purple-900/40 rounded-l-xl">الحصة ٥</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_TIMETABLE.map((row, idx) => (
                    <tr key={idx} className="border-b border-purple-800/30 hover:bg-purple-900/30 transition">
                      <td className="p-3 font-bold text-white">{row.day}</td>
                      {row.periods.map((period, pIdx) => (
                        <td key={pIdx} className="p-3 text-center">
                          <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                            {period}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Announcements Section */}
          <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📢</span>
              الإعلانات
            </h2>
            <div className="space-y-4">
              {SAMPLE_ANNOUNCEMENTS.map((announcement, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border-r-4 ${
                    announcement.urgent
                      ? "bg-red-900/20 border-red-500"
                      : "bg-purple-900/30 border-amber-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white">{announcement.title}</h3>
                    {announcement.urgent && (
                      <span className="px-2 py-0.5 rounded-full bg-red-900/40 text-red-400 border border-red-500/30 text-xs font-medium">عاجل</span>
                    )}
                  </div>
                  <p className="text-xs text-purple-400/60 mb-2">{announcement.date}</p>
                  <p className="text-sm text-purple-300/70">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses and Grades Section */}
        <div className="mt-6 bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📚</span>
            المواد والدرجات
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {SAMPLE_COURSES.map((course, idx) => (
              <div
                key={idx}
                className="group bg-purple-900/30 rounded-2xl p-5 border border-amber-500/10 hover-lift cursor-pointer hover:border-amber-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  {course.icon}
                </div>
                <h3 className="font-bold text-white mb-1">{course.name}</h3>
                <p className="text-sm text-purple-300/60 mb-4">{course.teacher}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-300/60">الدرجة:</span>
                  <span className="text-xl font-bold text-amber-400">{course.grade}%</span>
                </div>
                <div className="h-2 rounded-full bg-purple-900/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-amber-500 to-amber-400"
                    style={{ width: `${course.grade}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-purple-900/20 rounded-2xl p-5 border hover-lift ${highlight ? "border-amber-500/40 shadow-md shadow-amber-500/10" : "border-amber-500/10"}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <p className={`text-2xl font-bold ${highlight ? "text-amber-400" : "text-white"}`}>{value}</p>
          <p className="text-sm text-purple-300/60">{label}</p>
        </div>
      </div>
    </div>
  );
}
