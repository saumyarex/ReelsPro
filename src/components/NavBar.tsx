"use client";
import React, { useState } from "react";
import Image from "next/image";
import { User, CirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function NavBar() {
  // general variables
  const [searchInput, setSearchInput] = useState("");

  const { data: session } = useSession();

  const router = useRouter();

  const login = () => {
    router.push("/login");
  };

  const register = () => {
    router.push("/register");
  };

  const searchReels = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(searchInput);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="p-7 border-b-2 border-gray-200">
      <ul className="flex sm:gap-10 justify-between">
        {/* Logo */}
        <li className="sm:text-3xl text-2xl font-black ">REELSPRO</li>

        {/* Serach box */}
        <li className="w-full ">
          <form onSubmit={searchReels} className="w-full flex justify-center">
            <label className="input input-md rounded-4xl">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                value={searchInput}
                type="search"
                className="grow input-md"
                placeholder="Search"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </label>
          </form>
        </li>

        {/* users buttons */}
        {session ? (
          <li className="flex items-center gap-10">
            <div>
              <button className="btn btn-soft btn-primary">
                <input type="file" />
                <CirclePlus />
              </button>
            </div>
            <div className="avatar avatar-placeholder">
              <div className="bg-gray-400 hover:bg-gray-500 hover:cursor-pointer border-2 text-neutral-content w-12 rounded-full">
                <User />
              </div>
            </div>
          </li>
        ) : (
          <li className="flex gap-5 ">
            <button onClick={login} className="btn btn-soft btn-primary">
              Login
            </button>
            <button onClick={register} className="btn btn-soft btn-primary">
              Register
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
