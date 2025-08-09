import React from "react";

function page() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-5 pb-7 relative  max-h-screen  flex flex-col items-center">
        <video title="Video" className="rounded-lg bg-black h-full " controls>
          <source src={"/v.mp4"} />
        </video>

        <h2 className="font-semibold line-clamp-1 overflow-hidden pt-1 text-ellipsis absolute z-10 bottom-0 max-w-md px-5">
          Wealth creation games are positive sum games by Naval Raivkant in the
          podcast of
        </h2>
      </div>
    </div>
  );
}

export default page;
