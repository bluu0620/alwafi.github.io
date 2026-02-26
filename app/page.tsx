import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)]">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-900/30 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-amber-900/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-purple-800/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20">
            منصة تعليمية متكاملة
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-l from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              برنامج الوافي
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-200/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة للطلاب والمعلمين لإدارة المواد الدراسية والجداول والدرجات بكل سهولة
          </p>

          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up/student"
                className="group px-8 py-4 bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  تسجيل كطالب
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/sign-up/teacher"
                className="px-8 py-4 bg-purple-900/40 text-purple-200 rounded-2xl font-bold text-lg border border-purple-700/40 hover:bg-purple-800/50 hover:border-purple-500/50 transition-all duration-300"
              >
                تسجيل كمعلم
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-block px-10 py-5 bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] rounded-2xl font-bold text-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
            >
              الذهاب إلى لوحة التحكم
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="#" label="طالب مسجل" />
            <StatCard number="#" label="معلم متميز" />
            <StatCard number="#" label="مادة دراسية" />
            <StatCard number="#" label="نسبة الرضا" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-amber-600/20 via-purple-900/40 to-purple-800/20 border border-amber-500/20 p-12 text-center">
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-400">
                ابدأ رحلتك التعليمية اليوم
              </h2>
              <p className="text-lg text-purple-200/70 mb-8 max-w-xl mx-auto">
                انضم إلى طلاب ومعلمي برنامج الوافي
              </p>
              <SignedOut>
                <Link
                  href="/sign-up/student"
                  className="inline-block px-8 py-4 bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] rounded-2xl font-bold text-lg hover:opacity-90 transition shadow-xl shadow-amber-500/20"
                >
                  سجل الآن مجاناً
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-amber-500/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#0f0f1a] font-bold text-sm">
              و
            </div>
            <span className="text-lg font-bold text-amber-400">برنامج الوافي</span>
          </div>
          <p className="text-purple-400/50">جميع الحقوق محفوظة © ٢٠٢٥</p>
        </div>
      </footer>
    </main>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-500/10 hover-lift">
      <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">
        {number}
      </div>
      <div className="text-purple-300/70 font-medium">{label}</div>
    </div>
  );
}
