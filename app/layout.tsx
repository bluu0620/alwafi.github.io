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
import { cookies } from "next/headers";
import { ThemeProvider, type ThemeName, type ThemeMode } from "@/components/ThemeProvider";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { ThemeBar } from "@/components/ThemeBar";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "برنامج الوافي",
  description: "برنامج الوافي للطلاب والمعلمين - الجدول الدراسي والدرجات والمواد",
};

// Clerk appearance variables — dark/light only, independent of color palette
const CLERK_VARS: Record<ThemeMode, Record<string, string>> = {
  dark:  { colorPrimary: "#C8A84B", colorBackground: "#1C1C1C", colorInputBackground: "#2A2A2A", colorText: "#F0F0F0", colorTextSecondary: "#A0A0A0", colorNeutral: "#888888" },
  light: { colorPrimary: "#8A6800", colorBackground: "#F5F5F5", colorInputBackground: "#E8E8E8", colorText: "#1A1A1A", colorTextSecondary: "#606060", colorNeutral: "#585858" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme = (cookieStore.get("wafi-theme")?.value ?? "mono") as ThemeName;
  const initialMode = (cookieStore.get("wafi-mode")?.value ?? "dark") as ThemeMode;

  const clerkVars = CLERK_VARS[initialMode] ?? CLERK_VARS.dark;

  return (
    <ClerkProvider
      localization={arSA}
      appearance={{
        variables: {
          colorPrimary: clerkVars.colorPrimary,
          colorBackground: clerkVars.colorBackground,
          colorInputBackground: clerkVars.colorInputBackground,
          colorText: clerkVars.colorText,
          colorTextSecondary: clerkVars.colorTextSecondary,
          colorNeutral: clerkVars.colorNeutral,
          fontFamily: "Cairo, sans-serif",
          borderRadius: "0.75rem",
        },
        elements: {
          card: "shadow-2xl",
          formButtonPrimary: "font-bold transition hover:opacity-90",
          socialButtonsBlockButton: "border transition hover:opacity-80",
          formFieldInput: "transition focus:outline-none",
          avatarBox: "ring-2",
        },
      }}
    >
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <body className={`${cairo.variable} font-cairo antialiased bg-[#0f0f1a] min-h-screen text-white`}>
          <ThemeProvider initialTheme={initialTheme} initialMode={initialMode}>
            <ThemeWrapper>
              {/* Ambient background */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[150px]"
                  style={{ backgroundColor: "var(--accent)", opacity: 0.12 }} />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
                  style={{ backgroundColor: "var(--cta)", opacity: 0.08 }} />
              </div>

              <header className="sticky top-0 z-50 backdrop-blur-2xl border-b"
                style={{ backgroundColor: "color-mix(in srgb, var(--bg-page) 80%, transparent)", borderColor: "var(--border-accent)" }}>
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
                    {/* Theme palette dots */}
                    <ThemeBar />
                    {/* Dark / light toggle */}
                    <DarkModeToggle />
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

            </ThemeWrapper>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
