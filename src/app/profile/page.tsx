"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <p>This is the profile page.</p>
      <hr />
      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Log Out
      </button>
    </div>
  );
}

