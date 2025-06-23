"use client";
import { Spinner } from "@/components/ui/spiner";
import ArticlesAdmin from "@/components/views/articles/articlesPageAdmin";
import ArticlesUser from "@/components/views/articles/articlesPageUser";
import { getRole } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function articlePage() {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    const fetchRole = () => {
      const r = getRole();
      setRole(r || null);
    };
    fetchRole();
  }, []);
  return role === "Admin" ? (
    <ArticlesAdmin />
  ) : role === "User" ? (
    <ArticlesUser />
  ) : (
    <div className="h-full">
      <Spinner size="lg" />
    </div>
  );
}
