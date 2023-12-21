"use client";

import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
    const router = useRouter();

    const [userData,setUserData] = useState({
        username: "",
        email: "",
        _id: "",
    })

    const logout = async () => {
        try {
            const response = await axios.get("/api/users/logout");
            if(response.data.status === 201){
                toast.success("Logout successful");
                router.push("/login")
            }else{
                toast.error("Logout failed",response.data.error);
            }
        } catch (error:any) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const getUserDetails = async () => {
        const response = await axios.get("/api/users/data");
        console.log(response.data);
        const username = response.data.profileData.username;
        const _id = response.data.profileData._id;
        const email = response.data.profileData.email;
        setUserData({...userData,username:username,email:email,_id:_id});
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="mb-4 text-3xl font-bold">Profile</h1>
            <div className="flex flex-col gap-3 my-6 border-2 p-4 rounded-md">
                <div className="flex justify-between items-center">
                    <p className="text-xl">Username:{" "}</p>
                    {userData.username && <p className="ml-8 bg-green-500 rounded-md px-4 py-2 font-semibold">{userData.username}</p>}
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xl">Email:{" "}</p>
                    {userData.email && <p className="ml-8 bg-green-500 rounded-md px-4 py-2 font-semibold">{userData.email}</p>}
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xl">User id:{" "}</p>
                    {userData._id && <p className="ml-8 bg-green-500 rounded-md px-4 py-2 font-semibold">{userData._id}</p>}
                </div>
                <button onClick={getUserDetails} className="px-4 py-2 mt-4 self-center text-white border font-semibold rounded-lg hover:scale-105 transition bg-slate-900 border-slate-900">Get User Details</button>
            </div>
            <button onClick={logout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md hover:scale-105 transition">Logout</button>
        </div>
    )
}