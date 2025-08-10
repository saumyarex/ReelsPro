"use client";
import axios from "axios";
import React from "react";
import { IVideo } from "@/models/Video";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";

function Video() {
  const { videoId } = useParams();
  console.log(videoId);
  const [video, setVideo] = React.useState<IVideo>();
  console.log(video);
  console.log("video url", video?.videoURL);

  React.useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/video?videoId=${videoId}`);
        console.log("response", response);
        console.log(response.data.video.videoURL);
        setVideo(response.data.video);
      } catch (error) {
        console.log("Video fetching error:", error);
      }
    };
    fetchVideo();
  }, [videoId]);

  return (
    <>
      {video ? (
        <div className="min-h-screen flex justify-center">
          <div className="p-5 pb-7 relative  max-h-screen  flex flex-col items-center">
            <video
              title="Video"
              className="rounded-lg bg-black h-full "
              controls
            >
              <source src={video.videoURL} />
            </video>

            <h2 className="font-semibold line-clamp-1 overflow-hidden pt-1 text-ellipsis absolute z-10 bottom-0 max-w-md px-5">
              {video.title}
            </h2>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen justify-center items-center">
          <LoaderCircle className="animate-spin" />
        </div>
      )}
    </>
  );
}

export default Video;
