import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/DbConnect";
import Video from "@/models/Video";
import { IVideo } from "@/models/Video";

export async function GET(req: NextRequest) {
    console.log("Video fetch request")
    const {videoId} = await req.json();

    if(!videoId){
        return NextResponse.json({success: false, message:"Please give video ID"},{status: 400})
    }

    try {
        await DbConnect();

        const video: IVideo | null = await Video.findById(videoId);

        if(!video){
            return NextResponse.json({success: false, message:"Video not found"},{status: 404})
        }

        return NextResponse.json({success: true, message:"Video fetched successfully", videoURL : video.videoURL},{status: 404})

    } catch (error) {
         console.log("Fetching video error : ", error)
    if(error instanceof Error){
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }else{
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
    }
}