"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();

    const [user,setUser] = useState({
        email: "",
        password: "",
    })

    const [buttonDisabled,setbuttonDisabled] = useState(false)
    useEffect(()=>{
        if(user.email.length>0 && user.password.length>0){
            setbuttonDisabled(false);
        }else{
            setbuttonDisabled(true);
        }
    },[user])

    const [loading,setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log(response.data);
            if (response.data.status === 201) {
                // Successful signup
                console.log("Login success");
                toast.success("Logged in successfully");
                router.push("/profile");
            } else if (response.data.status === 400) {
                toast.error(response.data.error);
            } else {
                // Handle other error cases
                console.log(`Login failed. Status code: ${response.status}`);
                toast.error("Login failed. Please try again.");
            }
            
        } catch (error:any) {
            console.log("Login failed",error.message);
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold">Login Page</h1>
            <div className="mt-4 p-4 flex flex-col gap-3">
                <div className="p-2 flex gap-3 items-center justify-between">
                    <label htmlFor="email">Email:</label>
                    <input className="px-2 py-1 text-lg border border-slate-300 rounded-md focus:outline-none focus:border-gray-600" type="email" id="email" placeholder="Enter your email" value={user.email} onChange={(e)=>setUser({...user,email: e.target.value})} />
                </div>
                <div className="p-2 flex gap-3 items-center justify-between"> 
                    <label htmlFor="password">Password:</label>
                    <input className="px-2 py-1 text-lg border border-slate-300 rounded-md focus:outline-none focus:border-gray-600" type="password" id="password" placeholder="Enter your password" value={user.password} onChange={(e)=>setUser({...user,password: e.target.value})} />
                </div>
                <div className="p-2 text-blue-500 underline underline-offset-4">
                    <div><Link href='/forgotpassword'>Forgot password?</Link></div>
                </div>
                <button onClick={onLogin} disabled={buttonDisabled} className={`px-4 py-2 my-4 w-28 self-center text-white border font-semibold rounded-lg hover:scale-105 transition ${buttonDisabled ? 'bg-slate-400 border-slate-400 opacity-50 pointer-events-none' : 'bg-slate-900 border-slate-900'}`}>
                    <div className="flex justify-center">
                        {loading ? <Spinner/> : "Login"}
                    </div> 
                </button>
            </div>
            <Link href={"/signup"}>Visit Signup Page</Link>
        </div>
    )
}