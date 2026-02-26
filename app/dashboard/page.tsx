import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const role = user.unsafeMetadata?.role as string;

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "teacher") {
    redirect("/dashboard/teacher");
  } else {
    redirect("/dashboard/student");
  }
}
