"use client";
import React from "react";
import { useParams } from "next/navigation";
import Videos from "@/components/Videos";
import { EllipsisVertical } from "lucide-react";

function Profile() {
  const { user } = useParams();
  const userId = Array.isArray(user) ? user[0] : user;
  return (
    <div className="flex flex-col min-h-screen items-center p-5">
      <Videos userId={userId}></Videos>
      <div></div>
    </div>
  );
}

export default Profile;
