"use client";
import { Newspaper, Tag, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { removeProfile, removeRole, removeToken } from "@/lib/auth";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Articles",
    url: "/articles",
    icon: Newspaper,
  },
  {
    title: "Category",
    url: "/category",
    icon: Tag,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-5">
            <img src="/logo-white.svg" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.title === "Logout") {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link
                        href="/login"
                        onClick={() => {
                          removeToken();
                          removeRole();
                          removeProfile();
                        }}
                        className=" cursor-pointer"
                      >
                        <SidebarMenuButton size="lg">
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname.split("/")[1] === item.url.slice(1)}
                      size="lg"
                      asChild
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
