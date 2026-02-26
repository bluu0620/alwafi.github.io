import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const SAMPLE_COURSES = [
  { name: "فيلر", class: "الصف الثالث أ", students: 28, icon: "📐" },
  { name: "فيلر", class: "الصف الثالث ب", students: 25, icon: "📐" },
  { name: "فيلر", class: "الصف الرابع أ", students: 30, icon: "📐" },
];

const SAMPLE_SCHEDULE = [
  { time: "٨:٠٠ - ٨:٤٥", class: "الصف الثالث أ", subject: "فيلر", status: "current" },
  { time: "٨:٤٥ - ٩:٣٠", class: "الصف الثالث ب", subject: "فيلر", status: "upcoming" },
  { time: "١٠:٠٠ - ١٠:٤٥", class: "الصف الرابع أ", subject: "فيلر", status: "upcoming" },
  { time: "١٠:٤٥ - ١١:٣٠", class: "فراغ", subject: "-", status: "break" },
  { time: "١٢:٠٠ - ١٢:٤٥", class: "الصف الثالث أ", subject: "فيلر", status: "upcoming" },
];

const SAMPLE_PENDING_GRADES = [
  { student: "فلان فلان", class: "الصف الثالث أ", assignment: "فيلر فيلر فيلر", avatar: "ف" },
  { student: "فلان فلان", class: "الصف الثالث أ", assignment: "فيلر فيلر فيلر", avatar: "ف" },
  { student: "فلان فلان", class: "الصف الثالث ب", assignment: "فيلر فيلر فيلر", avatar: "ف" },
  { student: "فلان فلان", class: "الصف الرابع أ", assignment: "فيلر فيلر فيلر", avatar: "ف" },
];

const SAMPLE_ANNOUNCEMENTS = [
  { title: "فيلر فيلر فيلر", date: "٢٠٢٥/٠١/٠١", content: "فيلر فيلر فيلر فيلر فيلر فيلر", urgent: true },
  { title: "فيلر فيلر فيلر", date: "٢٠٢٥/٠١/٠١", content: "فيلر فيلر فيلر فيلر فيلر فيلر", urgent: false },
];

export default async function TeacherDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

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
              <p className="text-purple-300/60">لوحة تحكم المعلم - برنامج الوافي</p>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📅</span>
              جدول اليوم
            </h2>
            <div className="space-y-3">
              {SAMPLE_SCHEDULE.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl transition ${
                    item.status === "current"
                      ? "bg-amber-500/10 border-2 border-amber-500/40 shadow-md shadow-amber-500/10"
                      : item.status === "break"
                      ? "bg-purple-900/10 border border-purple-800/30"
                      : "bg-purple-900/20 border border-purple-800/30 hover:border-amber-500/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-mono px-3 py-1.5 rounded-lg ${
                      item.status === "current"
                        ? "bg-amber-500 text-[#0f0f1a] font-bold"
                        : "bg-purple-900/40 text-purple-300"
                    }`}>
                      {item.time}
                    </span>
                    <div>
                      <span className={`font-medium ${item.status === "break" ? "text-purple-400/40" : "text-white"}`}>
                        {item.class}
                      </span>
                      {item.status === "current" && (
                        <span className="mr-2 px-2 py-0.5 rounded-full bg-amber-500 text-[#0f0f1a] text-xs font-bold">الآن</span>
                      )}
                    </div>
                  </div>
                  <span className={`font-medium ${
                    item.status === "break" ? "text-purple-400/40" : "text-amber-400"
                  }`}>
                    {item.subject}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
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

        {/* My Courses */}
        <div className="mt-6 bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📚</span>
            الصفوف التي أدرسها
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_COURSES.map((course, idx) => (
              <div
                key={idx}
                className="group bg-purple-900/30 rounded-2xl p-6 border border-amber-500/10 hover-lift cursor-pointer hover:border-amber-500/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {course.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-1">{course.name}</h3>
                <p className="text-purple-300/60 mb-4">{course.class}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <span>👨‍🎓</span>
                    <span>{course.students} طالب</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Grades */}
        <div className="mt-6 bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">📝</span>
            درجات تحتاج مراجعة
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-4 text-right font-bold text-amber-400/70 bg-purple-900/40 rounded-r-xl">الطالب</th>
                  <th className="p-4 text-right font-bold text-amber-400/70 bg-purple-900/40">الصف</th>
                  <th className="p-4 text-right font-bold text-amber-400/70 bg-purple-900/40">الواجب/الاختبار</th>
                  <th className="p-4 text-center font-bold text-amber-400/70 bg-purple-900/40 rounded-l-xl">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_PENDING_GRADES.map((item, idx) => (
                  <tr key={idx} className="border-b border-purple-800/30 hover:bg-purple-900/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                          {item.avatar}
                        </div>
                        <span className="font-medium text-white">{item.student}</span>
                      </div>
                    </td>
                    <td className="p-4 text-purple-300/60">{item.class}</td>
                    <td className="p-4 text-purple-300/60">{item.assignment}</td>
                    <td className="p-4 text-center">
                      <button className="px-5 py-2 bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-amber-500/20">
                        إدخال الدرجة
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

