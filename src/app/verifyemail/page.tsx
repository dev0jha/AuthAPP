"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";


export default function VerifyEmail() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
 
     const verifyUserEmail = useCallback(async () => {
        try {
            await axios.post("/api/user/verifyEmail", { token });
            setVerified(true);
            toast.success("Email verified successfully");
        } catch (error: unknown) {
            setError(true);
            const err = error as { response?: { data?: { message?: string } } } | Error;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            console.log((err as any)?.response?.data?.message ?? "Email verification failed");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error((err as any)?.response?.data?.message || "Email verification failed");
        }
    }, [token]);

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
     }, [token, verifyUserEmail]);

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