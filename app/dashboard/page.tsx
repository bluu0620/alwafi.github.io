import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const role = user.unsafeMetadata?.role as string;
  const level = user.unsafeMetadata?.level as string | undefined;

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "teacher") {
    redirect("/dashboard/teacher");
  } else {
    // Students without a level go to onboarding first
    if (!level) {
      redirect("/onboarding");
    }
    redirect("/dashboard/student");
  }
}
