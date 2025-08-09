"use client";
import { useState, useRef, useEffect } from "react";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

function UploadPage() {
  const router = useRouter();
  const [publishActive, setPublishActive] = useState(false);
  const [videoDetails, setVideoDetails] = useState({
    title: "",
    description: "",
    videoURL: "",
    thumbnailURL: "",
  });

  const [publishing, setpublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //imagekit uploading progress
  const [progress, setProgress] = useState(0);
  const [uploading, setuploading] = useState(false);

  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  // Authenticates and retrieves the necessary upload credentials from the server.
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Imagekit Authentication error:", error);
      throw new Error("Imagekit authentication request failed");
    }
  };

  // Handles the file upload process
  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];
    if (file.size > 1024 * 1024 * 100) {
      console.log("Video size should be less than 100Mb");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
      setErrorMessage("Video size should be less than 100Mb");
      return;
    }
    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      setError(true);
      if (authError instanceof Error) {
        setErrorMessage(authError.message);
      } else {
        setErrorMessage("Imagekit authentication failed");
      }
      return;
    } finally {
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      setuploading(true);
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      setVideoDetails({
        ...videoDetails,
        videoURL: uploadResponse.url || "",
        thumbnailURL: uploadResponse.url || "",
      });
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
        //setError(error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
        setErrorMessage(error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
        setErrorMessage(error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
        setErrorMessage(error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
        setErrorMessage("Uploading failed. Please try again.");
      }
    } finally {
      setuploading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setVideoDetails({
      ...videoDetails,
      [name]: value,
    });
  };

  useEffect(() => {
    function checkInputs() {
      if (
        videoDetails.description &&
        videoDetails.title &&
        videoDetails.videoURL
      ) {
        setPublishActive(true);
      } else {
        setPublishActive(false);
      }
    }

    checkInputs();
  }, [videoDetails]);

  const publishVideo = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setpublishing(true);
      console.log("Uploading video data", videoDetails);
      const response = await axios.post("/api/videos", videoDetails);
      console.log("upload success", response);
      setSuccess(true);
      router.push("/");
    } catch (error: unknown) {
      console.error("uploading error : ", error);
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
      setVideoDetails({
        title: "",
        description: "",
        videoURL: "",
        thumbnailURL: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => {
        setSuccess(false);
      }, 1000);
      setpublishing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full  min-h-screen ">
      <form
        onSubmit={publishVideo}
        className="flex flex-col mt-15 max-w-3xl w-full gap-5 p-5 mx-5"
      >
        <h1 className="text-4xl sm:text-5xl font-black ">Upload your reel</h1>
        <label htmlFor="reel" className="font-semibold text-xl">
          Upload video
        </label>
        <input
          type="file"
          id="reel"
          ref={fileInputRef}
          className="file-input file-input-primary w-full"
          onChange={handleUpload}
        />
        {uploading && (
          <div className="flex flex-col">
            <div className="flex items-center">
              <LoaderCircle className="mr-3 animate-spin" />
              Uploading ...
            </div>
            <progress
              className="progress progress-primary w-full mt-2"
              value={progress}
              max="100"
            ></progress>
          </div>
        )}
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
            publishActive ? "" : "btn-disabled"
          } ${publishing ? "btn-disabled" : ""}`}
        >
          {publishing ? (
            <>
              <LoaderCircle className="animate-spin" />
              publishing...
            </>
          ) : (
            "Publish video"
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
          <span>Video published successfully!</span>
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

export default UploadPage;
