import React, { useState, useEffect } from "react";
import { Backdrop, Modal, Fade, Button, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OTPModal from "./OTPScreen";
import { useDispatch, useSelector } from "react-redux";
import { resetOtpState, sendOTP } from "../../redux/state/auth/Action";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import login from "../../images/login.webp";
import { toggleAuthModal } from "../../redux/state/ui/Action";
export default function SignUp() {
  const dispatch = useDispatch();
  const isOpen=useSelector((state)=>state.ui.isAuthModalOpen);
  const { loading, otpSent } = useSelector((state) => state.auth);
  const [isFocused, setIsFocused] = useState(false);
  const [emailError,setEmailError]=useState("");
  const [typingTimeout,setTypingTimeout]=useState(null)
  const [inputValue, setInputValue] = useState("");
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      dispatch(resetOtpState());
      setIsOtpScreen(false);
      setInputValue("");
      setIsFocused(false);
      setAcceptedTerms(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  useEffect(() => {
    if (otpSent && isOpen) {
      setIsOtpScreen(true);
    }
  }, [otpSent, isOpen]);

  const handleClose = () => {
    dispatch(toggleAuthModal(false));
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
                <OTPModal
                  email={inputValue}
                  closeModal={handleClose}
                />
              ) : (
                <>
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-semibold text-gray-900">
                      Login / SignUp
                      <div className="text-xs">Using OTP</div>
                      <hr className="w-[4rem] outline-black-50" />
                    </div>
                    <Button
                      onClick={handleClose}
                      className="text-black hover:text-red-700"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-xmark"
                        className="text-lg"
                      />
                    </Button>
                  </div>

                  {/* Email Input */}
                  <div className="relative w-full mt-6">
                    <label
                      className={`absolute left-3 transition-all duration-200 px-1 ${
                        isFocused || inputValue
                          ? "top-[-20px] text-xs text-gray-500"
                          : "top-2 text-gray-500"
                      }`}
                    >
                      Enter Email Id
                    </label>
                    <input
                      type="text"
                      value={inputValue}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(inputValue !== "")}
                      onChange={(e) => {
                        const value=e.target.value;
                        setInputValue(value);
                        if(typingTimeout) clearTimeout(typingTimeout);
                        const timeout = setTimeout(() => {
                          if (value.trim() === "") {
                            setEmailError(""); 
                          } else if (!validateEmail(value)) {
                            setEmailError("Please enter a valid email address.");
                          } else {
                            setEmailError(""); 
                          }
                        }, 500); 
                      
                        setTypingTimeout(timeout);
                      }}
                      
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {emailError && (
                      <p className="text-red-600 text-xs mt-1">{emailError}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center text-sm text-black">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={() => setAcceptedTerms(!acceptedTerms)}
                      className="mr-2 cursor-pointer"
                    />
                    <span>
                      I accept the{" "}
                      <u className="cursor-pointer">
                        Terms and Conditions & Privacy Policy
                      </u>
                      .
                    </span>
                  </div>
                  {/* Send OTP Button */}
                  <Button
                    className={`w-full mt-4 py-2 transition-all duration-300 ${
                      inputValue.trim() === "" || !acceptedTerms
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-800 text-white font-bold"
                    }`}
                    disabled={inputValue.trim() === "" || loading || emailError}
                    onClick={handleSendOtp}
                  >
                    {loading ? (
                      <CircularProgress size={24} className="text-white" />
                    ) : (
                      "Continue"
                    )}
                  </Button>

                 
                 
                </>
              )}
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
