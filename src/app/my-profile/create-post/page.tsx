"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call backend API or store in global state
    console.log("New post created:", content);

    // Redirect to profile page after creation
    router.push("/my-profile");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">Create Post</h1>
      <form className="w-full max-w-xl flex flex-col space-y-4" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          className="w-full p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Create
        </button>
      </form>
    </div>
  );
}
