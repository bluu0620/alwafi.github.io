import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ARABIC_LEVELS, ISLAMIC_LEVELS, LEVELS, PROGRAM_INFO } from "@/lib/program-data";
import { selectStudentLevel } from "./actions";

export default async function OnboardingPage() {
  const user = await currentUser();

  if (!user) redirect("/");
  if (user.unsafeMetadata?.role !== "student") redirect("/dashboard");

  // Already selected — go straight to dashboard
  if (user.unsafeMetadata?.level) redirect("/dashboard/student");

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-4xl mb-5">
            🎓
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-l from-amber-400 to-amber-300 bg-clip-text text-transparent mb-3">
            اختر مستواك الدراسي
          </h1>
          <p className="text-purple-300/60 text-lg">
            {PROGRAM_INFO.name} — {PROGRAM_INFO.semester} {PROGRAM_INFO.hijriYear}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
            <span>⚠️</span>
            <span>لا يمكن تغيير المستوى بعد الاختيار — تأكد من اختيارك</span>
          </div>
        </div>

        {/* Arabic Department */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
              📖
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-400">قسم اللغة العربية</h2>
              <p className="text-sm text-purple-300/50">المستويات الثاني والرابع</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ARABIC_LEVELS.map((level) => (
              <LevelCard
                key={level.id}
                levelId={level.id}
                name={level.name}
                shortName={level.shortName}
                leader={level.leader}
                subjectCount={level.subjects.length}
                color="amber"
              />
            ))}
          </div>
        </div>

        {/* Islamic Department */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
              🕌
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-300">القسم الشرعي</h2>
              <p className="text-sm text-purple-300/50">المستويات السادس والثامن والعاشر</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ISLAMIC_LEVELS.map((level) => (
              <LevelCard
                key={level.id}
                levelId={level.id}
                name={level.name}
                shortName={level.shortName}
                leader={level.leader}
                subjectCount={level.subjects.length}
                color="purple"
              />
            ))}
          </div>
        </div>

        {/* All subjects preview */}
        <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
          <h3 className="text-lg font-bold text-amber-400/80 mb-4 flex items-center gap-2">
            <span>📋</span> معاينة المواد حسب المستوى
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(LEVELS).map((lvl) => (
              <div key={lvl.id} className="bg-purple-900/30 rounded-xl p-4 border border-purple-800/30">
                <p className="font-bold text-white text-sm mb-2">{lvl.name}</p>
                <div className="flex flex-wrap gap-1">
                  {lvl.subjects.map((s) => (
                    <span key={s.name} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300/80">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function LevelCard({
  levelId,
  name,
  shortName,
  leader,
  subjectCount,
  color,
}: {
  levelId: string;
  name: string;
  shortName: string;
  leader: string;
  subjectCount: number;
  color: "amber" | "purple";
}) {
  const isAmber = color === "amber";
  const borderClass = isAmber
    ? "border-amber-500/20 hover:border-amber-500/50"
    : "border-purple-600/20 hover:border-purple-500/50";
  const bgClass = isAmber
    ? "bg-amber-500/10 border-amber-500/20"
    : "bg-purple-500/10 border-purple-500/20";
  const badgeClass = isAmber
    ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
    : "bg-purple-500/10 border border-purple-500/30 text-purple-300";
  const btnClass = isAmber
    ? "bg-amber-500 hover:bg-amber-400 text-black"
    : "bg-purple-600 hover:bg-purple-500 text-white";

  return (
    <div className={`group bg-purple-900/20 rounded-2xl border ${borderClass} p-5 transition-all duration-200 hover:bg-purple-900/30`}>
      {/* Short name badge */}
      <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center font-bold text-lg mb-4 ${isAmber ? "text-amber-400" : "text-purple-300"}`}>
        {shortName}
      </div>

      <h3 className="font-bold text-white mb-1 text-sm leading-tight">{name}</h3>

      {leader ? (
        <p className="text-xs text-purple-300/50 mb-3">{leader}</p>
      ) : (
        <p className="text-xs text-purple-300/30 mb-3">—</p>
      )}

      <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-4 ${badgeClass}`}>
        <span>{subjectCount} مواد</span>
      </div>

      <form
        action={async () => {
          "use server";
          await selectStudentLevel(levelId);
        }}
        className="w-full"
      >
        <button
          type="submit"
          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${btnClass}`}
        >
          اختر هذا المستوى
        </button>
      </form>
    </div>
  );
}
