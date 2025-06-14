"use client";
import { getProfile, removeProfile, removeRole, removeToken } from "@/lib/auth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ImageLogo from "@/public/logo.svg";
import ImageLogoWhite from "@/public/logo-white.svg";
import { LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileUser = JSON.parse(getProfile() || "{}");
  const pathname = usePathname();
  const router = useRouter();
  return (
    <main className="h-screen w-full flex flex-col">
      <div className="flex flex-row  py-2 px-4  w-full shadow-md  items-center justify-between">
        <div
          className="flex items-center gap-1"
          onClick={() => router.push("/articles")}
        >
          <Image src={ImageLogo} alt="logo" width={134} height={24} />
        </div>
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center gap-2">
              <Image
                className="rounded-full"
                width={36}
                height={36}
                alt="image"
                src={`https://ui-avatars.com/api/?name=${profileUser.username}`}
              />
              <span
                // onClick={() => router.push("/user-profile")}
                className=" underline cursor-pointer"
              >
                {profileUser.username || ""}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className=" w-60">
            <div className="flex flex-col">
              <span
                onClick={() => router.push("/user-profile")}
                className="p-1 hover:bg-slate-100 cursor-pointer"
              >
                My Acount
              </span>

              <Dialog>
                <DialogTrigger>
                  <span className="p-1 text-red-600 flex hover:bg-slate-100 cursor-pointer">
                    <LogOut /> Logout
                  </span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Logout</DialogTitle>
                    <DialogDescription>
                      Are you sure want to logout?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-row gap-2 justify-end w-full">
                    <DialogClose>
                      <Button variant="outline" className="w-full mb-2">
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button
                      onClick={() => {
                        removeToken();
                        removeRole();
                        removeProfile();
                        router.push("/login");
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <section>{children}</section>
      <footer className=" py-12 bg-blue-500 flex justify-center items-center text-white gap-4 flex-col sm:flex-row">
        <Image alt="logo-footer" src={ImageLogoWhite} width={134} height={24} />
        <p>© 2025 Blog genzet. All rights reserved.</p>
      </footer>
    </main>
  );
}
