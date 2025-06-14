"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/lib/auth";
import Image from "next/image";

export default function UserProfilePage() {
  const profileUser = JSON.parse(getProfile() || "{}");
  return (
    <div className="p-4 ">
      <Card className="flex-grow flex min-h-[calc(100vh-84px)] justify-center items-center flex-col ">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <Image
          className="rounded-full"
          width={68}
          height={68}
          alt="image"
          src={`https://ui-avatars.com/api/?name=${profileUser.username}`}
        />
        <div className="w-96 space-y-3 text-sm">
          <div className="flex justify-between items-center border px-4 py-2 rounded-md bg-gray-100">
            <span className="font-semibold">Username :</span>
            <span>{profileUser.username}</span>
          </div>
          <div className="flex justify-between items-center border px-4 py-2 rounded-md bg-gray-100">
            <span className="font-semibold">Password :</span>
            {/* <span>{profile.password}</span> */}
          </div>
          <div className="flex justify-between items-center border px-4 py-2 rounded-md bg-gray-100">
            <span className="font-semibold">Role :</span>
            <span>{profileUser.role}</span>
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
