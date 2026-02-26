import { SignUp } from "@clerk/nextjs";

export default function GraduateSignUpPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-white text-3xl mb-4 shadow-xl">
            🎓
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-l from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">
            تسجيل خريج جديد
          </h1>
          <p className="text-slate-600">
            أنشئ حسابك للوصول إلى البوابة الخاصة بالخريجين
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-2">
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "rounded-xl",
                formButtonPrimary:
                  "bg-gradient-to-l from-green-600 to-emerald-500 hover:opacity-90 rounded-xl",
              },
            }}
            unsafeMetadata={{
              role: "graduate",
            }}
            redirectUrl="/dashboard/graduate"
          />
        </div>
      </div>
    </div>
  );
}
