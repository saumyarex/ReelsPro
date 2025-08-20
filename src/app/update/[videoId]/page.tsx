"use client";
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function Updatepage() {
  const { videoId } = useParams();
  const router = useRouter();

  const [updateActive, setupdateActive] = useState(false);
  const [updating, setupdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [videoDetails, setVideoDetails] = React.useState({
    title: "",
    description: "",
    videoId: "",
  });

  React.useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/video?videoId=${videoId}`);
        setVideoDetails({
          title: response.data.video.title,
          description: response.data.video.description,
          videoId: response.data.video._id,
        });
      } catch (error) {
        console.log("Video fetching error:", error);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (videoDetails.description !== "" && videoDetails.title !== "") {
      setupdateActive(true);
    } else {
      setupdateActive(false);
    }

    setVideoDetails({
      ...videoDetails,
      [name]: value,
    });
  };

  const UpdateVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("new details", videoDetails);
    try {
      setupdating(true);
      const response = await axios.post("/api/update", videoDetails);
      console.log("Update success", response);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.replace(`/video/${videoDetails.videoId}`);
      }, 1000);
    } catch (error) {
      console.error("updating error : ", error);
      if (error instanceof axios.AxiosError) {
        setErrorMessage(error.response?.data.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Uploading failed. Try again");
      }
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    } finally {
      setupdating(false);
    }
  };
  return (
    <div className="flex flex-col items-center w-full  min-h-screen ">
      <form
        onSubmit={UpdateVideo}
        className="flex flex-col mt-15 max-w-3xl w-full gap-5 p-5 mx-5"
      >
        <h1 className="text-4xl sm:text-5xl font-black ">Update your reel</h1>
        <label htmlFor="title" className="font-semibold text-xl">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          value={videoDetails.title}
          required
          className="input w-full text-lg"
          onChange={(e) => handleChange(e)}
        />

        <label htmlFor="description" className="font-semibold text-xl">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={5}
          placeholder="Your desccription"
          value={videoDetails.description}
          required
          className="border-1 border-gray-300 rounded text-lg p-3 dark:bg-[#1d232a]"
          onChange={(e) => handleChange(e)}
        ></textarea>
        <button
          className={`btn btn-primary w-fit self-center ${
            updateActive ? "" : "btn-disabled"
          } ${updating ? "btn-disabled" : ""}`}
        >
          {updating ? (
            <>
              <LoaderCircle className="animate-spin" />
              updating...
            </>
          ) : (
            "Update video"
          )}
        </button>
      </form>
      {success && (
        <div role="alert" className="alert alert-success mt-5 ">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Video updated successfully!</span>
        </div>
      )}

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

export default Updatepage;
