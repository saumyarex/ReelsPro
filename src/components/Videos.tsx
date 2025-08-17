"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { IVideo } from "@/models/Video";

function Videos({ userId = "all" }) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [videos, setVideos] = useState<IVideo[]>([]);

  console.log(videos);
  console.log("userid : ", userId);

  async function fetchVideos() {
    try {
      const response = await axios.get(`/api/videos/?userId=${userId}`);
      console.log("videos response", response);
      setVideos(response.data.videos);
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        setErrorMessage(error.response?.data.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Video fetching failed. Try again");
      }
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="w-full mt-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mx-2 ">
        {videos.map((video) => (
          <Link
            href={`video/${video._id?.toString()}`}
            key={video._id?.toString()}
          >
            <div className="">
              <video title="Video" className="rounded-lg">
                <source src={video.videoURL} />
              </video>
              <h2 className="ml-1 font-semibold h-12 overflow-hidden text-ellipsis line-clamp-2">
                {video.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
      {error && (
        <div role="alert" className="alert alert-error mt-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! {errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Videos;
