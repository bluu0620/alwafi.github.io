import { SignUp } from "@clerk/nextjs";

export default function GraduateSignUpPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-xl border"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-accent)" }}
          >
            🎓
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-bright)" }}>
            تسجيل خريج جديد
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            أنشئ حسابك للوصول إلى البوابة الخاصة بالخريجين
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none bg-transparent",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
          unsafeMetadata={{ role: "graduate" }}
          redirectUrl="/dashboard/graduate"
        />
      </div>
    </div>
  );
}
