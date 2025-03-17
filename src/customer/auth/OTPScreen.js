import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";


export default function OTPModal({ goBack, resendOTP }) {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Start countdown timer
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    setTimer(30); // Restart timer
    setOtp(["", "", "", "", ""]); // Clear OTP fields
    inputRefs.current[0].focus(); // Focus on first field
    if (resendOTP) resendOTP(); // Call resend function if provided
  };

  return (
    <div className="w-full p-6 bg-[#F1C542] rounded-t-lg md:rounded-lg">
      <div className="text-xl font-semibold text-gray-900 text-center">
        Enter OTP
        <hr className="w-16 border-black mt-1 mx-auto" />
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2 mt-10">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ))}
      </div>

      {/* Verify Button */}
      <Button
        className={`w-full mt-4 py-2 rounded-lg transition-all duration-300 ${
          otp.join("").length !== 5
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "!bg-green-500 hover:!bg-green-800 !text-white !font-bold"
        }`}
        disabled={otp.join("").length !== 5}
      >
        Verify OTP
      </Button>

      {/* Timer & Resend OTP */}
      <div className="mt-2 text-center text-sm text-black">
        {timer > 0 ? (
          <span className="text-red-600">Resend OTP in {timer}s</span>
        ) : (
          <Button
            onClick={handleResendOTP}
            className="text-black "
          >
            Resend OTP
          </Button>
        )}
      </div>
    </div>
  );
}
