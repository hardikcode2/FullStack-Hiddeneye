"use client";
import { useState } from "react";
import Image from "next/image";
// import { useRouter } from "next/navigation";

import Footer from "../components/footer"; // adjust path if needed


export default function LoginPage() {
  // const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Login successful!");
        window.location.href = "/"; // hard redirect to home page
      } else {
        setMessage(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error while logging in.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      {/* Header Section */}
      <header className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-bold tracking-wide">HiddenEye</h1>
        <Image src="/logo.png" alt="HiddenEye Logo" width={60} height={60} />
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow">
        <p className="text-gray-300 text-lg mb-10 text-center max-w-lg">
          Welcome to an anonymous place where you can share without being judged.
        </p>

        <div className="bg-gray-800 bg-opacity-70 p-8 rounded-2xl shadow-2xl w-90 max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

          {message && (
            <p
              className={`text-center mb-4 ${
                message.includes("successful") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm text-gray-400 mb-2">College Mail</label>
              <input
                type="email"
                placeholder="example@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors py-3 rounded-md font-medium"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center mt-5">
            New user?{" "}
            <a href="/signup" className="text-indigo-400 hover:underline">
              Create account
            </a>
          </p>
        </div>
      </main>
      <Footer />

    </div>
  );
}
