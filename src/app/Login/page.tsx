"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType: category }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError(message || "Error logging in");
        return;
      }

      const { email: userEmail, userType, firstName, lastName, contactNumber } = await response.json();
      alert("Login successful!");

      localStorage.setItem("email", userEmail);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("contactNumber", contactNumber);

      router.push(`/Profile?userType=${userType}`);
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[500px] md:w-[600px] border-2 border-[#0F6466]"> {/* Form border */}
        <h2 className="text-4xl font-bold text-center text-[#0F6466] mb-8">Welcome</h2> {/* Larger title */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="role" className="block text-lg font-medium text-gray-700">Select Your Role</label>
            <select
              id="role"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-lg"  // Thicker idle border
              required>
              <option value="" disabled>Select Your Role</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-lg"  // Thicker idle border
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-lg"  // Thicker idle border
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#0F6466] text-white rounded-md shadow hover:bg-[#2C3532] transition-colors duration-200 font-semibold text-lg"  // Larger button
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
