"use client";
import { useEffect, useState } from "react";
import axios from "axios";

function Videos() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
    "/v.mp4",
  ]);
  console.log(videos);
  // async function fetchVideos() {
  //   try {
  //     const response = await axios.get("/api/videos");
  //     console.log("videos response", response.data);
  //     setVideos(response.data.videos);
  //   } catch (error) {
  //     if (error instanceof axios.AxiosError) {
  //       setErrorMessage(error.response?.data.message);
  //     } else if (error instanceof Error) {
  //       setErrorMessage(error.message);
  //     } else {
  //       setErrorMessage("Video fetching failed. Try again");
  //     }
  //     setError(true);
  //     setTimeout(() => {
  //       setError(false);
  //     }, 2000);
  //   }
  // }

  // useEffect(() => {
  //   fetchVideos();
  // }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 mx-2 ">
        {videos.map((video, index) => (
          <div key={index}>
            <video title="Video" className="rounded-lg">
              <source src={video} />
            </video>
            <h2 className="ml-1 font-semibold ">
              Wealth creation games are positive sum games
            </h2>
          </div>
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
