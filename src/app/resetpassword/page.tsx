"use client";

import axios from "axios";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

export default function ResetPassword() {

    const router = useRouter();

    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const [token,setToken] = useState("");

    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken)
    },[])   

    const [buttonDisabled,setbuttonDisabled] = useState(true);
    useEffect(()=>{
        if(password.length>0 && confirmPassword.length>0){
            setbuttonDisabled(false);
        }else{
            setbuttonDisabled(true);
        }
    },[password,confirmPassword])

    const [loading,setLoading] = useState(false);

    const resetPassword = async ()=>{
        try {
            setLoading(true);
            if(password!==confirmPassword){
                throw new Error("Passwords does not match")
            }
            const response = await axios.post("/api/users/resetpassword",{token,password})
            if(response.data.status==201){
                toast.success(response.data.message);
                router.push("/login");
            }else{
                toast.error(response.data.error);
            }
        } catch (error:any) {
            toast.error(error.message)
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <h1 className="text-4xl font-bold mb-4">Reset Password</h1>
            {!token ? (
                <h2 className="m-2 p-2 bg-orange-500 text-white">No Token found</h2>
            ) : (
                <div className="flex flex-col border-2 gap-3 rounded-md p-4">
                    <div className="p-2 flex gap-3 items-center justify-between"> 
                        <label className="text-lg" htmlFor="password">Password:</label>
                        <input className="ml-10 px-2 py-1 text-lg border border-slate-300 rounded-md focus:outline-none focus:border-gray-600" type="password" id="password" placeholder="Enter new password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                    <div className="p-2 flex gap-3 items-center justify-between"> 
                        <label className="text-lg" htmlFor="password">Confirm Password:</label>
                        <input className="ml-10 px-2 py-1 text-lg border border-slate-300 rounded-md focus:outline-none focus:border-gray-600" type="password" id="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                    </div>
                    <button onClick={resetPassword} disabled={buttonDisabled} className={`px-4 py-2 my-4 w-40 self-center text-white border font-semibold rounded-lg hover:scale-105 transition ${buttonDisabled ? 'bg-slate-400 border-slate-400 opacity-50 pointer-events-none' : 'bg-slate-900 border-slate-900'}`}>
                        <div className="flex justify-center">
                            {loading ? <Spinner/> : "Reset Password"}
                        </div> 
                    </button>
                </div>
            )}
        </div>
    )
}