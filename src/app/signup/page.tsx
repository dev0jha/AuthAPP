"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onSignUp = async () => {
    setLoading(true);
    try {
      const payload = {
        username: user.username.trim(),
        email: user.email.trim(),
        password: user.password,
      };
      const response = await axios.post("/api/user/signup", payload);
      console.log("Signup successful", response.data);
      toast.success("Account created. Please log in.");
      router.replace("/login");
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Signup failed";
      console.log("Signup failed", error?.response?.data ?? error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Sign Up"}</h1>
      <hr />
      <label htmlFor="username">username</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="username"
      />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />
      <button
        type="button"
        onClick={onSignUp}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        disabled={buttonDisabled || loading}
      >
        {buttonDisabled ? "No signUp" : loading ? "Processing..." : "Sign Up"}
      </button>
      <Link href="/login">Visit Login</Link>
    </div>
  );
}
