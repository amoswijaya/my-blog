// layoutProvider.tsx
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/adminLayout";
import { Spinner } from "../ui/spiner";
import { getRole } from "@/lib/auth";
import UserLayout from "./userLayout";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = () => {
      const r = getRole();
      setRole(r || null);
      setLoading(false);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    console.log(role);
  }, [role]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return role === "Admin" ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <UserLayout>{children}</UserLayout>
  );
}
