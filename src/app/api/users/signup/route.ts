import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {username,email,password} = reqBody;

        console.log(reqBody);

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            console.log("User already exists");
            return NextResponse.json({error: "User already exists",status: 400})
        }
        console.log("No user found");
        
        // hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        console.log(savedUser);

        // send verify email
        sendEmail({email:email,emailType:"VERIFY",userId:savedUser._id});
        
        return NextResponse.json({message:"User created successfully",status:201,savedUser})

    } catch (error:any) {
        return NextResponse.json({error: error.message,status:500})
    }
}