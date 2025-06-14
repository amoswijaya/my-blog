"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Image from "next/image";
import { getProfile } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const profileUser = JSON.parse(getProfile() || "{}");
  const pathname = usePathname();
  const router = useRouter();
  const namePage =
    pathname.split("/")[1].charAt(0).toUpperCase() +
    pathname.split("/")[1].slice(1);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-screen w-full flex flex-col">
        <div className="flex flex-row  py-2 px-4  w-full shadow-md bg-white items-center justify-between">
          <div className="flex items-center gap-1">
            <SidebarTrigger className=" md:block" />
            <span className=" font-bold text-xl ">
              {namePage
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              className="rounded-full"
              width={36}
              height={36}
              alt="image"
              src={`https://ui-avatars.com/api/?name=${profileUser.username}`}
            />
            <span
              onClick={() => router.push("/user-profile")}
              className=" underline cursor-pointer"
            >
              {profileUser.username || ""}
            </span>
          </div>
        </div>
        <div className="flex-grow bg-[#f3f4f6] overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
