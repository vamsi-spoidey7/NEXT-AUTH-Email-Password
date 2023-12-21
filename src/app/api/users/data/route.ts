import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import {connect} from "@/dbConfig/dbConfig"

connect();

export async function GET(request:NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id:userId}).select("-password -isAdmin -isVerified -__v");
        console.log(user);
        return NextResponse.json({
            message: "User found",
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error:error.meesage,status:400})
    }
}