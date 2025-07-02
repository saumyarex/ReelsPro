import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/DbConnect";


export async function POST(request: NextRequest) {

    try {
        const {email, password} = await request.json();

        if(!email || !password){
            NextResponse.json({success: false, message:"Email and password is required"},{status: 400})
        }

        DbConnect();

        const emailExist = await User.findOne({email});
        if(emailExist){
            NextResponse.json({success: false, message:"Email already exist"},{status: 400})
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json({success: true, message:"User registration successful"},{status: 201})

    } catch (error: unknown) {
        if(error instanceof Error){
            NextResponse.json({success: false, message: error.message},{status: 500})
        }else {
            NextResponse.json({success: false, message:"Internal server error"},{status: 500})
        }
        
    }
}