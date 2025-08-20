"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { EllipsisVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Videos({ userId = "all" }) {
  const { data: session } = useSession();
  console.log("session", session?.user?.id);
  const router = useRouter();

  const [editMenuActive, setEditMenuActive] = useState(false);
  const [currentVideoMenu, setCurrentVideoMenu] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [deleteMenuActive, setDeleteMenuActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
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
    fetchVideos();
  }, [userId]);

  const activeMenu = (videoId: string | undefined) => {
    setCurrentVideoMenu(videoId ?? "");
    setEditMenuActive(!editMenuActive);
  };

  const onClickingDelete = () => {
    setEditMenuActive(false);
    setDeleteMenuActive(true);
  };

  const deleteVideo = async () => {
    try {
      console.log("Video deleted", currentVideoMenu);
      setDeleting(true);
      await axios.delete(`/api/delete?videoId=${currentVideoMenu}`);
      setSuccess(true);
      setDeleteMenuActive(false);
      router.refresh();
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        setErrorMessage(error.response?.data.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Video fetching failed. Try again");
      }
      setError(true);
      setDeleteMenuActive(false);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full mt-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2  ">
        {videos.map((video) => (
          <div className="relative" key={video._id?.toString()}>
            <Link href={`/video/${video._id?.toString()}`}>
              <video title="Video" className="rounded-lg">
                <source src={video.videoURL} />
              </video>
            </Link>

            {session?.user?.id === userId ? (
              <div
                className="absolute top-0 right-0 bg-gray-900/50 hover:bg-gray-900/90 p-2 rounded-full hover:cursor-pointer active:bg-gray-900/90 "
                onClick={() => activeMenu(video._id?.toString())}
              >
                <EllipsisVertical className=" text-white" />
              </div>
            ) : null}

            {editMenuActive && currentVideoMenu === video._id?.toString() && (
              <div
                className="absolute top-10 right-2 bg-white/70 
             dark:bg-black/70 flex flex-col items-start rounded-xs "
              >
                <button className="hover:bg-gray-200 px-3 w-full rounded-xs active:bg-gray-400 dark:hover:bg-gray-600">
                  <Link href={`/update/${video._id?.toString()}`}>Edit</Link>
                </button>
                <button
                  className="hover:bg-gray-200 px-3 w-full rounded-xs active:bg-gray-400 dark:hover:bg-gray-600 hover:cursor-pointer"
                  onClick={onClickingDelete}
                >
                  Delete
                </button>
              </div>
            )}

            <h2 className="ml-1 font-semibold h-12 overflow-hidden text-ellipsis line-clamp-2">
              {video.title}
            </h2>
          </div>
        ))}
      </div>

      {success && (
        <div className="flex justify-center relative z-50">
          <div role="alert" className="alert alert-success mt-5  max-w-xs">
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
            <span>Video deleted successfully!</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-center relative z-50">
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
        </div>
      )}

      {deleteMenuActive && (
        <div className="absolute left-0 bottom-0 z-40 w-full h-full bg-gray-300/60 flex justify-center items-center">
          <div className="bg-gray-100 dark:bg-gray-950 p-5 rounded-md font-semibold">
            Are you sure you want to delete the video?
            <div className="w-full h-full flex justify-center items-center gap-7 mt-3">
              <button
                className="bg-gray-300 text-black p-1 px-2 rounded-md hover:bg-gray-400 hover:cursor-pointer active:bg-gray-500"
                onClick={() => setDeleteMenuActive(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-400 text-black p-1 px-2 rounded-md hover:bg-red-500 hover:cursor-pointer active:bg-red-600"
                onClick={deleteVideo}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Videos;
