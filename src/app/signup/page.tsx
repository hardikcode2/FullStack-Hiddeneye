"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "../components/footer"; 

// Function to check that email domain and college name are same 
// function emailMatchesCollege(email: string, college: string) {
//   if (!email.includes("@") || !college) return false;

//   const domain = email.split("@")[1].toLowerCase();
//   const col = college.toLowerCase().trim();
//   return domain.includes(col);
// }

export default function SignupPage() {
  const router = useRouter();

  const [collegeName, setCollegeName] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpLoading, setOtpLoading] = useState(false); // for OTP sending state


  const isEmailValid = email.includes("@") && email.includes(".");
// COLLEGE EMAIL Verification Check below (commented so you can use any email for testing);
  // const isEmailValid =
  // email.includes("@") &&
  // ((/(\.ac\.in$)|(\.edu$)/i.test(email)) && emailMatchesCollege(email, collegeName));
  const passwordsMatch = password && repeatPassword && password === repeatPassword;

  // Send OTP
  const handleSendOtp = async () => {
    if (otpLoading) return; // prevent multiple clicks
    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage("OTP sent! Check your email.");
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error while sending OTP");
    }
    finally {
    setOtpLoading(false); // re-enable button
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        setMessage("OTP verified successfully!");
      } else {
        setMessage(data.error || "Failed to verify OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error while verifying OTP");
    }
  };

  // Create Account
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/create-ac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college: collegeName,
          email,
          password,
          confirmPassword: repeatPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Account created successfully!");
        
        // Optional: clear fields
        setCollegeName("");
        setEmail("");
        setOtp("");
        setPassword("");
        setRepeatPassword("");
        setOtpSent(false);
        setOtpVerified(false);

        // Auto-redirect to /login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage(data.error || "Failed to create account");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error while creating account");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      <header className="flex justify-between items-center px-10 py-6">
        <h1 className="text-4xl font-bold tracking-wide">HiddenEye</h1>
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
      </header>

      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-gray-800 bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-lg space-y-6">
          <h2 className="text-3xl font-semibold mb-4 text-center">Create Account</h2>

          {message && <p className="text-center text-green-400">{message}</p>}

          <form className="space-y-5" onSubmit={handleCreateAccount}>
            {/* College Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">College Name</label>
              <input
                type="text"
                placeholder="Your display name"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* College Email + Verify */}
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">College Email</label>
                <input
                  type="email"
                  placeholder="example@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={otpVerified}
                  className={`w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none ${
                    otpVerified ? "cursor-not-allowed bg-gray-700" : ""
                  }`}
                />
              </div>
              {!otpVerified && (
                <button
                  type="button"
                  className={`mt-5 px-5 py-3 rounded-lg font-medium transition ${
                    isEmailValid  || otpLoading ?"bg-indigo-600 hover:bg-indigo-700"
                   : "bg-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!isEmailValid || otpLoading}
                  onClick={handleSendOtp}
                >
                  {otpLoading ? "Sending..." : "Verify"}
                </button>
              )}
            </div>

            {/* OTP Input */}
            {otpSent && !otpVerified && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white text-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                />
                <button
                  type="button"
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium transition"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </div>
            )}

            {/* Password Fields */}
            {otpVerified && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Repeat Password</label>
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!passwordsMatch}
                  className={`w-full py-3 mt-3 rounded-lg font-medium transition ${
                    passwordsMatch ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  Create Account
                </button>
              </>
            )}
          </form>
        </div>
      </main>
      <Footer />

    </div>
  );
}
