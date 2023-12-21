"use client";

import axios from "axios";
import { useState,useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VerifyEmail() {
    const [token,setToken] = useState("");
    const [verified,setVerified] = useState(false);

    const verifyUserEmail = async ()=>{
        try {
            const response = await axios.post("/api/users/verifyemail",{token})
            if(response.data.status===201){
                toast.success("User verified successfully");
                setVerified(true);
            }else{
                toast.error("User not found or token error");
                setVerified(false);
            }
        } catch (error:any) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "");
    },[])

    useEffect(()=>{
        if(token.length > 0){
            verifyUserEmail();
        }
        //eslint-disable-next-line
    },[token])

    return (
        <div className="flex flex-col justify-center items-center min-h-screen py-2">
            {!token && <h2 className="m-2 p-2 bg-orange-500 text-white">No Token found</h2>}
            {verified ? (
                <div className="flex flex-col justify-center mt-4">
                    <h2 className="text-2xl flex items-center">Email Verified 
                        <span >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                        </span>
                    </h2>
                    <Link href={"/login"} className="px-4 py-1 my-4 w-22 self-center text-white border font-semibold rounded-lg hover:scale-105 transition bg-slate-900 border-slate-900">Login</Link>
                </div>
            ) : (
                <div className="m-2 p-2 bg-orange-500 text-white">User not found or token error</div>
            )}
        </div>
    )
}