"use client";
import React, { useState } from "react";
import { User, CirclePlus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function NavBar() {
  // general variables
  const [searchInput, setSearchInput] = useState("");
  const [profileMenuDisaplay, setProfileMenuDisplay] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);

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

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const toggelMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
  };
  return (
    <nav className="p-7 border-b-2 border-gray-200">
      <ul className="flex sm:flex-row flex-col sm:gap-5 sm:space-y-0 space-y-4 justify-between items-center">
        {/* Logo */}
        <li className="text-2xl md:text-3xl font-black ">REELSPRO</li>

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

        {/* desktop users buttons */}
        {session ? (
          <li className="sm:flex hidden items-center gap-10  ">
            <div>
              <Link href={"/upload"}>
                <button className="btn btn-soft btn-primary dark:broder-1 dark:border-neutral-100">
                  <CirclePlus />
                  Upload
                </button>
              </Link>
            </div>
            <div
              className="relative"
              onMouseEnter={() => setProfileMenuDisplay(true)}
              onMouseLeave={() => setProfileMenuDisplay(false)}
            >
              <div className="avatar avatar-placeholder">
                <div className="bg-gray-400 hover:bg-gray-500 hover:cursor-pointer border-2 text-neutral-content w-12 rounded-full">
                  <User />
                </div>
              </div>

              {profileMenuDisaplay && (
                <div className="h-20 absolute -right-5">
                  <div className="bg-gray-950 border-1 border-gray-200 px-5 py-2 rounded-md w-full   mt-2 text-white">
                    <Link href={"/profile"}>
                      <button className="hover:cursor-pointer hover:text-gray-400">
                        Profile
                      </button>
                    </Link>

                    <button
                      className="hover:cursor-pointer hover:text-gray-400"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ) : (
          <li className="sm:flex hidden gap-5 ">
            <button onClick={login} className="btn btn-soft btn-primary">
              Login
            </button>
            <button onClick={register} className="btn btn-soft btn-primary">
              Register
            </button>
          </li>
        )}

        {/* mobile users buttons */}
        <div className="absolute top-5 px-5 flex flex-col  items-end  sm:hidden w-full">
          <label className="btn btn-circle swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" onClick={toggelMobileMenu} />

            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
          {session ? (
            <>
              {mobileMenuActive && (
                <div className="flex flex-col mt-2 self-start text-lg w-full font-medium ">
                  <Link href={"/profile"}>
                    <button className=" bg-white dark:bg-[#0a0a0a] dark:active:text-gray-500 active:text-gray-500 w-full py-2 rounded-t border-b-1 border-gray-300">
                      Profile
                    </button>
                  </Link>

                  <button
                    onClick={logout}
                    className=" bg-white dark:bg-[#0a0a0a] dark:active:text-gray-500 active:text-gray-500 border-gray-500 w-full py-2 rounded-b"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {mobileMenuActive && (
                <div className="flex flex-col mt-2 self-start text-lg w-full font-medium ">
                  <Link href={"/login"}>
                    {" "}
                    <button className=" bg-white dark:bg-[#0a0a0a] dark:active:text-gray-500 active:text-gray-500  w-full py-2 rounded-t border-b-1 border-gray-300">
                      Login
                    </button>
                  </Link>
                  <Link href={"/register"}>
                    <button className=" bg-white dark:bg-[#0a0a0a] dark:active:text-gray-500 active:text-gray-500  border-gray-500 w-full py-2 rounded-b">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default NavBar;
