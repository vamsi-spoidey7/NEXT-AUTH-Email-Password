import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function POST(request:NextRequest){
    try {
        const reqBody = request.json();
        const {token} = await reqBody;
        const user = await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})
        if(!user){
            return NextResponse.json({error:"User not found or token invalid",status:400})
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({message:"User verified successfully",success:true,status:201})
    } catch (error:any) {
        return NextResponse.json({error:error.message,status:500})
    }
}