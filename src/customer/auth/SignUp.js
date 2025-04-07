import React, { useState, useEffect } from "react";
import { Backdrop, Modal, Fade, Button, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OTPModal from "./OTPScreen";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP } from "../../redux/state/auth/Action";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import login from "../../images/login.webp";
export default function SignUp({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { loading, error, otpSent } = useSelector((state) => state.auth);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isOtpScreen, setIsOtpScreen] = useState(false);

  useEffect(() => {
    if (otpSent) {
      setIsOtpScreen(true);
    }
  }, [otpSent]);

  const handleClose = () => {
    setIsOpen(false);
    setIsOtpScreen(false);
    setInputValue("");
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSendOtp = () => {
    if (!validateEmail(inputValue)) return;
    dispatch(sendOTP(inputValue));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Modal
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isOpen}>
          <div className="fixed md:absolute bottom-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-1/2 max-h-[25rem] overflow-y-auto bg-white shadow-xl rounded-t-2xl md:rounded-lg flex flex-col md:flex-row transition-transform duration-500 ease-in-out">
            {/* Left Section (Hidden on Mobile) */}
            <div className="hidden md:flex w-2/5 bg-gray-200 items-center justify-center rounded-lg">
              <LazyImage src={login} alt="login " className="" />
            </div>

            {/* Right Section */}
            <div className="w-full md:w-3/5 px-6 py-6 bg-[#F1C542] rounded-r-2xl md:rounded-r-lg">
              {isOtpScreen ? (
                <OTPModal email={inputValue} closeModal={() => setIsOpen(false)} />

              ) : (
                <>
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-semibold text-gray-900">
                      Login / SignUp
                      <div className="text-xs">Using OTP</div>
                      <hr className="w-[4rem] outline-black-50" />
                    </div>
                    <Button onClick={handleClose} className="text-black hover:text-red-700">
                      <FontAwesomeIcon icon="fa-solid fa-xmark" className="text-lg" />
                    </Button>
                  </div>

                  {/* Email Input */}
                  <div className="relative w-full mt-6">
                    <label
                      className={`absolute left-3 transition-all duration-200 px-1 ${
                        isFocused || inputValue ? "top-[-20px] text-xs text-gray-500" : "top-2 text-gray-500"
                      }`}
                    >
                      Enter Email Id
                    </label>
                    <input
                      type="text"
                      value={inputValue}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(inputValue !== "")}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                  </div>

                  {/* Send OTP Button */}
                  <Button
                    className={`w-full mt-4 py-2 transition-all duration-300 ${
                      inputValue.trim() === "" ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-green-500 hover:bg-green-800 text-white font-bold"
                    }`}
                    disabled={inputValue.trim() === "" || loading}
                    onClick={handleSendOtp}
                  >
                    {loading ? <CircularProgress size={24} className="text-white" /> : "Continue"}
                  </Button>

                  {/* Terms & Conditions */}
                  <div className="mt-3 text-black text-center text-sm leading-6">
                    By continuing, I accept TCP -{" "}
                    <u className="cursor-pointer">Terms and Conditions & Privacy Policy.</u>
                  </div>
                </>
              )}
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
