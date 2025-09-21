"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { set } from "mongoose";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const handleLogout = async () => {
    try {
      await axios.get("/api/user/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: unknown) {
      console.error(error?.message ?? "Something went wrong during logout");
      toast.error("Something went wrong during logout");
    }
  };
 const getUserDetails =async() => {
   const res=await axios.get("/api/user/me")
      console.log(res.data);
       setData(res.data.data._id);
 }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <p>This is the profile page.</p>
      <h2 className="p-1 rounded bg-amber-200">{data==='nothing'?"Nothing": <Link
       href={`/profile/${data}`}>{data}
        </Link>
        }</h2>
      <hr />
      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Log Out
      </button>

      <button
        onClick={getUserDetails}
        className="px-4 py-2 mt-4 bg-amber-600 text-white rounded hover:bg-green-800 transition"
      >
        GetData
      </button>
    </div>
  );
}

