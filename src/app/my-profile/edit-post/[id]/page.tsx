"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditPostProps {
  params: { id: string };
}

export default function EditPost({ params }: EditPostProps) {
  const router = useRouter();
  const postId = params.id;

  // For demo, prefill with dummy content
  const [content, setContent] = useState(`Post ${postId} content`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update post in backend or global state
    console.log("Updated post:", { postId, content });
    router.push("/my-profile"); // redirect back to profile
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">Edit Post {postId}</h1>
      <form className="w-full max-w-xl flex flex-col space-y-4" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}
