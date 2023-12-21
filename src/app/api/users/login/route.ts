import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {email,password} = reqBody;
        console.log(reqBody);

        // check if user exists
        const user = await User.findOne({email});
        if(!user){
            console.log('user doesnt exists');
            return NextResponse.json({error:"User doesnt exists",status:400})
        }

        // check if password is correct
        const validPassword = await bcryptjs.compare(password,user.password)
        if(!validPassword){
            console.log("password wrong");
            return NextResponse.json({error:"Invalid Password",status:400})
        }

        if(user.isVerified == false){
            return NextResponse.json({error:"User is not verified",status:400})
        }

        // create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        // create token
        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn: "1d"})
        const response = NextResponse.json({
            message:"Login Successful",
            success:true,
            status:201
        })
        response.cookies.set("token",token,{
            httpOnly: true
        })
        return response;
        
    } catch (error:any) {
        return NextResponse.json({error:error.message,status:500})
    }
}
