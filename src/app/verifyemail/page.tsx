"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";


export default function VerifyEmail() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
 
     const verifyUserEmail = async () => {
        try {
            await axios.post("/api/user/verifyEmail", { token });
            setVerified(true);
            toast.success("Email verified successfully");
        } catch (err: any) {
            setError(true);
            console.log(err?.response?.data?.message ?? "Email verification failed");
            toast.error(err?.response?.data?.message || "Email verification failed");
        }
    }

    // Parse token from URL once on mount and set state
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, []);

     // When token state is set, trigger verification (only once)
     useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
     }, [token]);

     return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Email Verification</h1>
            <hr />
            {verified ? (
                <h2 className="text-green-500 bg-gray-200">Email verified successfully</h2>
            ) : error ? (
                <h2 className="text-red-500 bg-gray-200">Email verification failed</h2>
            ) : (
                <h2 className="text-amber-500 bg-gray-200">Verifying...</h2>
            )}
            <hr />
            <Link href="/login">Login</Link>
        </div>
    )   
}