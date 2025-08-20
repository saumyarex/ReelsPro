import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/DbConnect";
import Video from "@/models/Video";
import { getServerSession } from "next-auth/next"
import { authOption } from "@/lib/autOptions";


export async function DELETE(req: NextRequest) {

    const session = await getServerSession(authOption);
    console.log(session)
    const user = session?.user;

    if(!user){
        return NextResponse.json({success: false, message:"Unauthorized request. Please login!"}, {status: 401})
    }

    try {

        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get('videoId');


        await DbConnect();

        await Video.deleteOne({_id: videoId})

        return NextResponse.json({success: true, message:"Video deleted successfully"}, {status: 201})
    
} catch (error) {
    console.log("Error uploaing video : ", error)
    if(error instanceof Error){
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }else{
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}
}