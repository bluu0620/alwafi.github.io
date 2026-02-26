import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const role = user.unsafeMetadata?.role as string;
  const level = user.unsafeMetadata?.level as string | undefined;

  if (role === "admin" || role === "dev") {
    redirect("/dashboard/admin");
  } else if (role === "teacher") {
    redirect("/dashboard/teacher");
  } else if (role === "student") {
    if (!level) {
      redirect("/onboarding");
    }
    redirect("/dashboard/student");
  } else if (role === "graduate") {
    redirect("/dashboard/graduate");
  } else {
    // No role assigned yet — send back to home
    redirect("/");
  }
}
