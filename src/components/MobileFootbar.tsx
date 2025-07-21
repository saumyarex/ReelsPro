import React from "react";
import { CirclePlus, User, House } from "lucide-react";
import Link from "next/link";

function MobileFootbar() {
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
        <li>
          <Link href={"/profile"}>
            <User />
          </Link>
        </li>
      </ul>
    </footer>
  );
}

export default MobileFootbar;
