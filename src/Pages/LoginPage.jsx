import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]); // Default OTP as empty
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input box if the current box is filled
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, 4); // Get first 4 digits
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Autofocus the last input box
      inputsRef.current[3].focus();
    }
    e.preventDefault();
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const otpValue = otp.join(""); // Combine OTP from all inputs
      const response = await fetch(
        "https://assignment.stage.crafto.app/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, otp: otpValue }),
        }
      );
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/quotes"); // Replace "/quotes" with your actual quote list route
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OTP
          </label>
          <div className="flex space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onPaste={handlePaste}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
