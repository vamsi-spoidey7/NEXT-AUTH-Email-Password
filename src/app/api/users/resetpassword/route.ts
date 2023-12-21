import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs"

connect();

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {token,password} = reqBody;

        // find user        
        const user = await User.findOne({forgotPasswordToken: token,forgotPasswordTokenExpiry:{$gt:Date.now()}})
        if(!user){
            return NextResponse.json({error:"User not found or invalid token",status:400})
        }

        const hashedPassword = await bcryptjs.hash(password,10);
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        user.password = hashedPassword;

        await user.save();
        return NextResponse.json({message:"Password changed successfully",success:true,status:201});
    } catch (error:any) {
        return NextResponse.json({error:error.message,status:500})
    }
}