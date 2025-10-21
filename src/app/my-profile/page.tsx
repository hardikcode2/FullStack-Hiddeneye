"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "../components/footer"; // adjust path if needed


export default function MyProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<{ collegeName: string; collegeEmail: string }>({
    collegeName: "",
    collegeEmail: "",
  });

  const [posts, setPosts] = useState<{ id: number; content: string }[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newContent, setNewContent] = useState("");

  // Fetch logged-in user profile info
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (res.ok && data.user) {
          setUser({ collegeName: data.user.college, collegeEmail: data.user.email });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    fetchUser();
  }, []);

  // Fetch logged-in users posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/my-posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    }
    fetchPosts();
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setNewContent("");
  };

  const submitCreate = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent,
          college: user.collegeName, // send dynamic college name
        }),
      });

      const data = await res.json();

      if (res.ok && data.post) {
        setPosts([data.post, ...posts]);
        setIsCreating(false);
        setNewContent("");
      } else {
        alert(data.error || "Failed to create post");
      }
    } catch (err) {
      console.error("Create post failed:", err);
      alert("Failed to create post");
    }
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setNewContent("");
  };

  const startEdit = (post: { id: number; content: string }) => {
    setEditingPostId(post.id);
    setEditingContent(post.content);
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch("/api/posts/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content: editingContent }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(posts.map((p) => (p.id === id ? { ...p, content: editingContent } : p)));
        setEditingPostId(null);
        setEditingContent("");
      } else {
        alert(data.error || "Failed to edit post");
      }
    } catch (err) {
      console.error("Edit post failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch("/api/posts/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        alert(data.error || "Failed to delete post");
      }
    } catch (err) {
      console.error("Delete post failed:", err);
    }
  };

  // Logout
  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 py-4 sm:py-6 bg-gradient-to-br from-purple-900 via-black/50 to-black shadow-md space-y-4 sm:space-y-0">
      <Link href="/">
  <div className="flex items-center space-x-3">
    <Image src="/logo.png" alt="Logo" width={50} height={50} />
    <h1 className="text-2xl font-bold text-white">HiddenEye</h1>
  </div>
  </Link>
  <div className="flex space-x-3">
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


      {/* Profile Section */}
      <main className="flex-grow p-10 space-y-10">
        <h2 className="text-3xl font-semibold mb-4 text-center">My Profile</h2>

        {/* Profile Info */}
        <div className="bg-gray-900 p-8 rounded-3xl shadow-lg max-w-6xl mx-auto flex flex-col space-y-8">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <label className="text-gray-400 font-medium mb-1">College Name</label>
              <input type="text" value={user.collegeName} readOnly className="bg-gray-700 text-white px-4 py-2.5 rounded-md border border-gray-700 w-full focus:outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400 font-medium mb-1">College Email</label>
              <input type="email" value={user.collegeEmail} readOnly className="bg-gray-700 text-white px-4 py-2.5 rounded-md border border-gray-700 w-full focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">My Posts</h3>
            <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
              Create Post
            </button>
          </div>

          {/* Create Form */}
          {isCreating && (
            <div className="bg-gray-900 p-8 rounded-3xl shadow-lg mb-6 max-w-4xl mx-auto flex flex-col space-y-4">
              <textarea
                className="w-full h-80 p-6 rounded-2xl border border-gray-400 focus:outline-none text-white bg-gray-800 resize-none"
                placeholder="Write your post here..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <div className="flex justify-end space-x-4">
                <button onClick={submitCreate} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition">
                  Submit
                </button>
                <button onClick={cancelCreate} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-100 text-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                {editingPostId === post.id ? (
                  <div className="flex flex-col space-y-3">
                    <textarea
                      className="w-full p-4 rounded-2xl border border-gray-400 focus:outline-none"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <button onClick={() => saveEdit(post.id)} className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-white transition">
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                        <p className="whitespace-pre-line">
                      {post.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line.replace(/"/g, "&quot;")}
                          <br />
                        </span>
                      ))}
                    </p>



                    <div className="flex justify-end mt-4 space-x-3">
                      <button
                        onClick={() => startEdit(post)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white transition shadow-md shadow-black/50 border border-yellow-700 hover:shadow-lg hover:shadow-black/70"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white transition shadow-md shadow-black/50 border border-red-800 hover:shadow-lg hover:shadow-black/70"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {posts.length === 0 && <p className="text-center text-gray-400">No posts yet. Click "Create Post" to add one.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

