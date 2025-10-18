"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300 py-5 border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 space-y-3 sm:space-y-0">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} • Developed by{" "}
          <span className="font-semibold text-indigo-400">Hardik Chaurasia</span>
        </p>

        <div className="flex space-x-5 text-xl">
          <a
            href="https://github.com/hardikcode2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/hardik-chaurasia-6a12692bb/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
