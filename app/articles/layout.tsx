// file: app/articles/layout.tsx

import { cookies } from "next/headers";
import AdminLayout from "@/components/layout/adminLayout";
import UserLayout from "@/components/layout/userLayout";

export default async function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("role")?.value;

  if (userRole === "Admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <UserLayout>{children}</UserLayout>;
}
