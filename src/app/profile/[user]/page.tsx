"use client";
import React from "react";
import { useParams } from "next/navigation";
import Videos from "@/components/Videos";
function Profile() {
  const { user } = useParams();
  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-3xl border-b-2 w-full text-center pb-5 border-gray-500">
        {user}
      </h1>
      <Videos></Videos>
    </div>
  );
}

export default Profile;
