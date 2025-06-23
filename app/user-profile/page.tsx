"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/lib/auth";
import Image from "next/image";

export default function UserProfilePage() {
  const profileUser = JSON.parse(getProfile() || "{}");
  return (
    <div className="">
      <Card className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>

        <Image
          className="rounded-full mb-4"
          width={68}
          height={68}
          alt="image"
          src={`https://ui-avatars.com/api/?name=${profileUser.username}`}
        />

        <div className="w-full max-w-md space-y-3 text-sm">
          <div className="flex justify-between gap-2 border px-4 py-2 rounded-md bg-gray-100">
            <span className="font-semibold">Username:</span>
            <span className="truncate">{profileUser.username}</span>
          </div>

          <div className="flex justify-between gap-2 border px-4 py-2 rounded-md bg-gray-100">
            <span className="font-semibold">Password:</span>
            <span className="italic text-gray-500">••••••••</span>
          </div>

          <div className="flex justify-between gap-2 border px-4 py-2 rounded-md bg-gray-100">
            <span className="font-semibold">Role:</span>
            <span className="truncate">{profileUser.role}</span>
          </div>

          <Button
            className="w-full"
            onClick={() => (window.location.href = "/articles")}
          >
            Back to dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
