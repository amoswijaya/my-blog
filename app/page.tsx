"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spiner";
import LayoutProvider from "@/components/layout/layoutProvider";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/articles");
  }, [router]);
  return (
    <LayoutProvider>
      <div className="h-screen w-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    </LayoutProvider>
  );
}
