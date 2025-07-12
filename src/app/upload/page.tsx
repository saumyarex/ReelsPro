"use client";
import React, { useState } from "react";

function UploadPage() {
  const [publishActive, setPublishActive] = useState(true);
  return (
    <div className="flex justify-center w-full  min-h-screen ">
      <form className="flex flex-col mt-15 max-w-3xl w-full gap-5 p-5 mx-5">
        <h1 className="text-4xl sm:text-5xl font-black ">Upload your reel</h1>
        <label htmlFor="reel" className="font-semibold text-xl">
          Upload video
        </label>
        <input
          type="file"
          id="reel"
          className="file-input file-input-primary w-full"
        />
        <label htmlFor="title" className="font-semibold text-xl">
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Title"
          required
          className="input w-full text-lg"
        />

        <label htmlFor="description" className="font-semibold text-xl">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={5}
          placeholder="Your desccription"
          required
          className="border-1 border-gray-300 rounded text-lg p-3 dark:bg-[#1d232a]"
        ></textarea>
        <button
          className={`btn btn-primary w-fit self-center ${
            publishActive ? "btn-disabled" : ""
          }`}
        >
          Publish video
        </button>
      </form>
    </div>
  );
}

export default UploadPage;
