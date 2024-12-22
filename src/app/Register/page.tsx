"use client";
import { useState } from "react";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName, lastName, email, password, userType, contactNumber, employeeCode, adminCode
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register user.");
      }

      alert("Registration successful!");
      // Reset form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
      setContactNumber("");
      setEmployeeCode("");
      setAdminCode("");
    } catch (error) {
      setError("User Already Exist");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] border-2 border-[#0F6466]"> {/* Reduced padding and width */}
        <h2 className="text-2xl font-bold text-center text-[#0F6466] mb-4">Register</h2> {/* Reduced heading size */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Two-column layout for first and last name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-base font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base" /* Smaller input size */
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-base font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base"
            />
          </div>

          {/* Two-column layout for password and confirm password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base"
              />
            </div>
          </div>

          <div>
            <label htmlFor="userType" className="block text-base font-medium text-gray-700">User Type</label>
            <select 
              id="userType" 
              value={userType} 
              onChange={(e) => setUserType(e.target.value)}
              className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base"
              required
            >
              <option value="" disabled>Select User Type</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-base font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base"
            />
          </div>

          {/* Conditional Fields for Teacher and Admin */}
          {userType === "Teacher" && (
            <div>
              <label htmlFor="employeeCode" className="block text-base font-medium text-gray-700">Employee Code</label>
              <input
                type="text"
                id="employeeCode"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                required
                className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base"
              />
            </div>
          )}
          
          {userType === "Admin" && (
            <div>
              <label htmlFor="adminCode" className="block text-base font-medium text-gray-700">Admin Code</label>
              <input
                type="text"
                id="adminCode"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                className="mt-1 block w-full bg-white border-2 border-gray-400 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200 sm:text-base"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#0F6466] text-white rounded-md shadow hover:bg-[#2C3532] transition-colors duration-200 font-semibold text-base" /* Smaller button size */
          >
            Register
          </button>

          <div className="text-center mt-4">
            Already have an account? <a href="Login#" className="text-[#0F6466]">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
