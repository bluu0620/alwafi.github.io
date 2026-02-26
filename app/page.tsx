import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <Image
          src="/wafilogo.png"
          alt="شعار الوافي"
          width={140}
          height={140}
          className="rounded-3xl mx-auto mb-6"
        />

        <h1 className="text-4xl font-bold text-amber-400 mb-2">برنامج الوافي</h1>
        <p className="text-purple-300/50 mb-10">الفصل الثاني — ١٤٤٧هـ</p>

        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link
              href="/sign-up"
              className="w-full py-4 bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:opacity-95 transition-all duration-200"
            >
              إنشاء حساب
            </Link>
            <Link
              href="/sign-in"
              className="w-full py-4 bg-purple-900/40 text-purple-200 rounded-2xl font-bold text-lg border border-purple-700/40 hover:bg-purple-800/50 hover:border-purple-500/50 transition-all duration-200"
            >
              تسجيل الدخول
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <Link
            href="/dashboard"
            className="inline-block w-full py-4 bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] rounded-2xl font-bold text-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:opacity-95 transition-all duration-200"
          >
            الذهاب إلى لوحة التحكم
          </Link>
        </SignedIn>

      </div>
    </main>
  );
}
