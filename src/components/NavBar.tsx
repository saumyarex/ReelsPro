"use client";
import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

function NavBar() {
  const [searchInput, setSearchInput] = useState("");
  const session = true;

  const searchReels = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(searchInput);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="p-7">
      <ul>
        {/* Logo */}
        <li className="sm:text-3xl text-2xl font-black ">REELSPRO</li>

        {/* Serach box */}
        <li>
          <form onSubmit={searchReels}>
            <label className="input rounded-4xl">
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
                className="grow"
                placeholder="Search"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </label>
          </form>
        </li>

        {/* users buttons */}
        {session ? (
          <li className="">
            <div className="avatar avatar-placeholder">
              <div className="bg-gray-400 border-2 text-neutral-content w-12 rounded-full">
                <User />
              </div>
            </div>
          </li>
        ) : (
          <li>
            <button className="btn btn-soft btn-primary">Login</button>
            <button className="btn btn-soft btn-primary">Register</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
