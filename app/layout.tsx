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

// Clerk appearance variables keyed by theme + mode
const CLERK_VARS: Record<ThemeName, Record<ThemeMode, Record<string, string>>> = {
  library: {
    dark:  { colorPrimary: "#4F81C7", colorBackground: "#252A32", colorInputBackground: "#2E3440", colorText: "#E6E1D9", colorTextSecondary: "#A8A29A", colorNeutral: "#A8A29A" },
    light: { colorPrimary: "#1E3A5F", colorBackground: "#EDE8DF", colorInputBackground: "#DDD6C8", colorText: "#1A1512", colorTextSecondary: "#7A7265", colorNeutral: "#3A3530" },
  },
  science: {
    dark:  { colorPrimary: "#2EC4B6", colorBackground: "#1F2C36", colorInputBackground: "#263845", colorText: "#DFF6F0", colorTextSecondary: "#90A8B0", colorNeutral: "#90A8B0" },
    light: { colorPrimary: "#006D77", colorBackground: "#E8F5F4", colorInputBackground: "#D5EDEC", colorText: "#0D2B2E", colorTextSecondary: "#5A8A8F", colorNeutral: "#2A5A5F" },
  },
  campus: {
    dark:  { colorPrimary: "#84A98C", colorBackground: "#1F2520", colorInputBackground: "#272E28", colorText: "#D5E8D8", colorTextSecondary: "#8AAB8E", colorNeutral: "#8AAB8E" },
    light: { colorPrimary: "#2F3E46", colorBackground: "#EAF0E8", colorInputBackground: "#D8E5D5", colorText: "#141E20", colorTextSecondary: "#527558", colorNeutral: "#3A5040" },
  },
  authority: {
    dark:  { colorPrimary: "#B08968", colorBackground: "#241F1A", colorInputBackground: "#2D2620", colorText: "#EDE0D4", colorTextSecondary: "#A08070", colorNeutral: "#A08070" },
    light: { colorPrimary: "#5E3023", colorBackground: "#F2EBE4", colorInputBackground: "#E5D9CF", colorText: "#1A0A05", colorTextSecondary: "#80503A", colorNeutral: "#5E3A25" },
  },
  stem: {
    dark:  { colorPrimary: "#5BC0BE", colorBackground: "#1A2236", colorInputBackground: "#212D45", colorText: "#D8EEF0", colorTextSecondary: "#8AB0B8", colorNeutral: "#8AB0B8" },
    light: { colorPrimary: "#003049", colorBackground: "#E6EEF2", colorInputBackground: "#D0DFE8", colorText: "#001018", colorTextSecondary: "#3A6888", colorNeutral: "#1A4060" },
  },
  mono: {
    dark:  { colorPrimary: "#C8C8C8", colorBackground: "#252525", colorInputBackground: "#333333", colorText: "#F0F0F0", colorTextSecondary: "#B0B0B0", colorNeutral: "#909090" },
    light: { colorPrimary: "#303030", colorBackground: "#E8E8E8", colorInputBackground: "#D5D5D5", colorText: "#1A1A1A", colorTextSecondary: "#606060", colorNeutral: "#585858" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme = (cookieStore.get("wafi-theme")?.value ?? "mono") as ThemeName;
  const initialMode = (cookieStore.get("wafi-mode")?.value ?? "dark") as ThemeMode;

  const clerkVars = CLERK_VARS[initialTheme]?.[initialMode] ?? CLERK_VARS.mono.dark;

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
          card: "shadow-2xl border border-[rgba(255,255,255,0.06)]",
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
