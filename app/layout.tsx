import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { arSA } from "@clerk/localizations";
import { Cairo } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "برنامج الوافي",
  description: "برنامج الوافي للطلاب والمعلمين - الجدول الدراسي والدرجات والمواد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={arSA}>
      <html lang="ar" dir="rtl">
        <body className={`${cairo.variable} font-cairo antialiased bg-[#0f0f1a] min-h-screen text-white`}>
          {/* Ambient background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px]" />
          </div>

          <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0f0f1a]/80 border-b border-amber-500/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/wafilogo.png"
                  alt="شعار الوافي"
                  width={44}
                  height={44}
                  className="rounded-xl"
                />
                <span className="text-xl font-bold text-amber-400">
                  برنامج الوافي
                </span>
              </Link>
              <div className="flex gap-3 items-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] font-bold hover:opacity-90 transition shadow-lg shadow-amber-500/20">
                      تسجيل الدخول
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 rounded-xl bg-purple-900/50 text-purple-200 font-medium hover:bg-purple-800/50 transition border border-purple-700/30"
                  >
                    لوحة التحكم
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 ring-2 ring-amber-500/50"
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </div>
          </header>
          <div className="relative">
            {children}
          </div>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
