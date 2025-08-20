import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/DbConnect";
import Video from "@/models/Video";
import { getServerSession } from "next-auth/next"
import { authOption } from "@/lib/autOptions";
import mongoose from "mongoose";


export async function POST(req: NextRequest) {

    const session = await getServerSession(authOption);
    console.log(session)
    const user = session?.user;
    console.log(session)
    console.log("logged in user",user)

    if(!user){
        return NextResponse.json({success: false, message:"Unauthorized request. Please login!"}, {status: 401})
    }

    try {

        const body = await req.json();

        if( !body.title || !body.description || !body.videoId){
           return NextResponse.json({success: false, message:"All fields are required"}, {status: 400})
        }

        if (!mongoose.Types.ObjectId.isValid(body.videoId)) {
        return NextResponse.json(
            { success: false, message: "Invalid video ID" },
            { status: 400 }
        );
        }

        await DbConnect();


        const video = await Video.findById(body.videoId);

        if(!video){
             return NextResponse.json({success: false, message:"Video does not exist"}, {status: 400})
        }

        video.title = body.title;
        video.description = body.description;
        await video.save();

        return NextResponse.json({success: true, message:"Video updated successfully",}, {status: 201})
    
} catch (error) {
    console.log("Error uploaing video : ", error)
    if(error instanceof Error){
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }else{
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}
}