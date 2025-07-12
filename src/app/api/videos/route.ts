import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/DbConnect";
import Video from "@/models/Video";
import { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth/next"
import { authOption } from "@/lib/autOptions";


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

        const body : IVideo = await req.json();

        if( !body.title || !body.description || !body.videoURL || !body.thumbnailURL){
           return NextResponse.json({success: false, message:"All fields are required"}, {status: 400})
        }

        await DbConnect();

        const videoData : IVideo = {
            ...body,
            userId: user?.id as string,
            controls: body?.controls || true,
            transformation : {
                height : 1080,
                width : 1920,
                quality : body.transformation?.quality ?? 100,
            }
        }

        const newVideo = await Video.create(videoData)

        if(!newVideo){
           return NextResponse.json({success: false, message:"Uploading failed"}, {status: 500})
        }

        return NextResponse.json({success: true, message:"Video uploaded successfully", videoURl : newVideo.videoURL}, {status: 201})
    
} catch (error) {
    console.log("Error uploaing video : ", error)
    if(error instanceof Error){
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }else{
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}
}

export async function GET() {
    try {

        const videos = await Video.find({}).sort({createdAt: -1}).lean()

        if(!videos || videos.length === 0 ){
            return NextResponse.json([], {status: 200})
        }
        return NextResponse.json(videos)

        
    } catch (error) {
        console.log("Fetching video error : ", error)
    if(error instanceof Error){
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }else{
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
    }
}




