import React, { useState, useRef, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP } from "../../redux/state/auth/Action";

export default function OTPModal({ email, closeModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const { verified, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (verified) {
      closeModal();
      setTimeout(() => navigate("/profile"), 300);
    }
  }, [verified, closeModal, navigate]);
  
  

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join(""); 
    if (!email || !enteredOtp) {
      console.error("Email or OTP is missing!");
      return;
    }
    setLoading(true);
    await dispatch(verifyOTP(email, enteredOtp, navigate));
    setLoading(false);
    
    if (verified) {
      closeModal();
    }
  };
  

  const handleResendOTP = () => {
    dispatch(sendOTP(email));
    setTimer(30);
    setOtp(["", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="w-full p-6 md:p-0 bg-[#F1C542] rounded-lg md:mt-16 lg:mt-0">
      <div className="text-xl font-semibold text-gray-900 text-center">
        Enter OTP
        <hr className="w-16 border-black mt-1 mx-auto" />
        <p className="text-xs">OTP sent successfully to: {email}</p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2 mt-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 md:w-8 md:h-8 md:text-sm text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ))}
      </div>

      {/* Verify Button with Loader */}
      <Button
        onClick={handleVerifyOTP}
        className="w-full mt-4 py-2 rounded-lg transition-all duration-300 
          disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed 
          !bg-green-500 hover:!bg-green-800 !text-white !font-bold"
        disabled={otp.join("").length !== 5 || loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verify OTP"}
      </Button>

      {/* Error Message */}
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

      {/* Timer & Resend OTP */}
      <div className="mt-1 text-center text-sm text-black">
        {timer > 0 ? (
          <span className="text-red-600">Resend OTP in {timer}s</span>
        ) : (
          <Button onClick={handleResendOTP} className="text-black">
            Resend OTP
          </Button>
        )}
      </div>

      {/* Success Message */}
      {verified && <div className="text-green-600 text-sm mt-2">OTP Verified Successfully!</div>}
    </div>
  );
}