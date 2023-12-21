"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

export default function SignupPage() {
    
    const router = useRouter();

    const [user,setUser] = useState({
        email: "",
        password: "",
        username: ""
    })

    const [buttonDisabled,setbuttonDisabled] = useState(true);
    useEffect(()=>{
        if(user.email.length>0 && user.username.length>0 && user.password.length>0){
            setbuttonDisabled(false);
        }else{
            setbuttonDisabled(true);
        }
    },[user])

    const [loading,setLoading] = useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log(response.data);
            if (response.data.status === 201) {
                // Successful signup
                console.log("Signup success. Response data:", response.data);
                toast.success("User created successfully");
                toast.success("Verification Email sent");
                router.push("/login");
            } else if (response.data.status === 400) {
                // User already exists
                console.log("Signup failed. User already exists");
                toast.error("User already exists");
            } else {
                // Handle other error cases
                console.log(`Signup failed. Status code: ${response.status}`);
                toast.error("Signup failed. Please try again.");
            }
        } catch (error:any) {
            console.log(`Signup falied. Error: ${error.message}`);
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold">SignUp Page</h1>
            <div className="mt-4 p-4 flex flex-col gap-3">
                <div className="p-2 flex gap-3 items-center justify-between">
                    <label className="px-2 text-lg" htmlFor="username">Username:</label>
                    <input className="px-2 py-1 text-lg border border-slate-300 rounded-md focus:outline-none focus:border-gray-600" type="text" id="username" placeholder="Enter your username" value={user.username} onChange={(e)=>setUser({...user,username: e.target.value})} />
                </div>
                <div className="p-2 flex gap-3 items-center justify-between">
                    <label className="px-2 text-lg" htmlFor="email">Email:</label>
                    <input className="px-2 py-1 text-lg border border-slate-300 rounded-md focus:outline-none focus:border-gray-600" type="email" id="email" placeholder="Enter your email" value={user.email} onChange={(e)=>setUser({...user,email: e.target.value})} />
                </div>
                <div className="p-2 flex gap-3 items-center justify-between"> 
                    <label className="px-2 text-lg" htmlFor="password">Password:</label>
                    <input className="px-2 py-1 text-lg border border-slate-300 rounded-md focus:outline-none focus:border-gray-600" type="password" id="password" placeholder="Enter your password" value={user.password} onChange={(e)=>setUser({...user,password: e.target.value})} />
                </div>
                <button onClick={onSignup} disabled={buttonDisabled} className={`px-4 py-2 my-4 w-28 self-center text-white border font-semibold rounded-lg hover:scale-105 transition ${buttonDisabled ? 'bg-slate-400 border-slate-400 opacity-50 pointer-events-none' : 'bg-slate-900 border-slate-900'}`}>
                    <div className="flex justify-center">
                        {loading ? <Spinner/> : "Signup"}
                    </div> 
                </button>
            </div>
            <Link href={"/login"}>Visit Login Page</Link>
        </div>
    )
}