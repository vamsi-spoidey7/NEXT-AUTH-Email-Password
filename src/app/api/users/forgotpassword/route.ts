import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {email} = reqBody;

        // check if email exists
        const user = await User.findOne({email});
        if(!user){
            console.log("email doesnt exists");
            return NextResponse.json({error:"Email doesnt exist",status:400});
        }

        const userId = user._id;
        sendEmail({email:email,emailType:"RESET",userId:userId})
        return NextResponse.json({message:"Reset password mail sent",success:true,status:201})

    } catch (error:any) {
        return NextResponse.json({error:error.meesage,status:500})
    }
}