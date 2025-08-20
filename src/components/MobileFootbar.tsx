"use client";
import React from "react";
import { CirclePlus, User, House } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function MobileFootbar() {
  const { data: session } = useSession();
  const router = useRouter();
  function navigateToprofile() {
    if (!session) {
      router.push("/login");
    } else {
      router.push(`/profile/${session?.user?.id}`);
    }
  }
  return (
    <footer className="p-3 fixed dark:bg-[#0a0a0a] bg-[#ffffff] bottom-0 w-full border-2 rounded-lg border-gray-200 sm:hidden">
      <ul className="flex justify-between items-center">
        <li>
          <Link href={"/"}>
            <House />
          </Link>
        </li>
        <li>
          <Link href={"/upload"}>
            <CirclePlus />
          </Link>
        </li>
        <li onClick={navigateToprofile}>
          <User />
        </li>
      </ul>
    </footer>
  );
}

export default MobileFootbar;
