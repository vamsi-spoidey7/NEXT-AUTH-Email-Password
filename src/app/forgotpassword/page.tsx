"use client";

import axios from "axios";
import { useState,useEffect } from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

export default function ForgotPassword() {

    const router = useRouter();

    const [email,setEmail] = useState("")

    const [buttonDisabled,setbuttonDisabled] = useState(true);
    useEffect(()=>{
        if(email.length>0){
            setbuttonDisabled(false);
        }else{
            setbuttonDisabled(true);
        }
    },[email])

    const [loading,setLoading] = useState(false);

    const sendResetEmail = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/forgotpassword",{email});
            console.log(response.data);
            if(response.data.status===201){
                toast.success(response.data.message);
                router.push("/login");
            }else{
                toast.error(response.data.error);
            }
        } catch (error:any) {
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center py-2 min-h-screen border rounded">
            <h1 className="text-4xl font-bold mb-8">Forgot Passowrd ?</h1>
            <div className="p-4 border border-slate-300 rounded-md flex flex-col gap-4">
                <p>Enter email to send reset password</p>
                <input className="px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:border-gray-600" type="email" id="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <button onClick={sendResetEmail} disabled={buttonDisabled} className={`px-4 py-2 my-4 w-40 self-center text-white border font-semibold rounded-lg hover:scale-105 transition ${buttonDisabled ? 'bg-slate-400 border-slate-400 opacity-50 pointer-events-none' : 'bg-slate-900 border-slate-900'}`}>
                    <div className="flex justify-center">
                        {loading ? <Spinner/> : "Send Email"}
                    </div> 
                </button>
            </div>
        </div>
    )
}