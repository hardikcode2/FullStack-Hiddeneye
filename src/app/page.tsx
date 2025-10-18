"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "./components/footer"; // adjust path if needed

type Post = {
  id: number;
  content: string;
  college: string;
};

type CollegeGroup = {
  id: number;
  college: string;
  posts: Post[];
};

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<CollegeGroup[]>([]);

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  // ✅ Fetch global posts from API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data: Post[] = await res.json();

        const grouped: CollegeGroup[] = data.reduce((acc: CollegeGroup[], post: Post) => {
          const collegeGroup = acc.find(c => c.college === post.college);
          if (collegeGroup) {
            collegeGroup.posts.push(post);
          } else {
            acc.push({ id: post.id, college: post.college, posts: [post] });
          }
          return acc;
        }, []);

        setPosts(grouped);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-900 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 bg-gradient-to-br from-purple-900 via-black/50 to-black shadow-md">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold text-white">HiddenEye</h1>
        </div>
        <div className="space-x-4">
          <Link href="/my-profile">
            <button className="px-4 py-2 bg-transparent text-white border-2 border-blue-900 rounded-lg transition hover:border-blue-500 hover:bg-blue-900/30">
              My Profile
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-transparent text-white border-2 border-red-700 rounded-lg transition hover:border-red-500 hover:bg-red-700/30"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Feed */}
      <main className="flex-grow p-10 space-y-10">
        {posts.map((collegeGroup) => (
          <div key={collegeGroup.id}>
            <h2 className="text-2xl font-semibold text-white mb-6">{collegeGroup.college}</h2>
            <div className="space-y-6">
              {collegeGroup.posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-100 text-gray-900 p-8 rounded-3xl shadow-lg hover:shadow-xl transition"
                >
                  <p className="text-lg leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
