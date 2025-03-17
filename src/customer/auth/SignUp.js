import React, { useState } from "react";
import { Backdrop, Modal, Fade, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OTPModal from "./OTPScreen";
export default function SignUp({isOpen,setIsOpen}) {
  
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
    setIsOtpScreen(false); 
  };


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isOpen}>
          <div
            className="fixed md:absolute bottom-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 
            md:-translate-y-1/2 w-full md:w-1/2 max-h-[25rem] overflow-y-auto bg-white 
           shadow-xl rounded-t-2xl md:rounded-lg flex flex-col 
            md:flex-row transition-transform duration-500 ease-in-out"
          >

            {/* Left Side (Hidden on mobile) */}
            <div className="hidden md:flex w-2/5 bg-white-500 items-center justify-center rounded-lg">
              <span className="text-black font-bold">Left</span>
            </div>
            
            <div className="w-full md:w-3/5 px-6 py-6 bg-[#F1C542] rounded-r-2xl md:rounded-r-lg">
            {isOtpScreen?(
                <OTPModal />
            ):(
              <>
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

              
              <div className="md:mt-20 lg:mt-10">
              <div className="relative w-full mt-6">
                    <label
                      className={`absolute left-3 transition-all duration-200 px-1 
                        ${isFocused || inputValue ? "top-[-20px] text-xs text-white-500" : "top-2 text-gray-500"}`}
                    >
                      Enter Phone Number/ Email Id
                    </label>
                    <input
                      type="text"
                      value={inputValue}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(inputValue !== "")}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
              </div>

              {/* Continue Button */}
              <Button
                className={`w-full mt-4 py-2 transition-all duration-300 ${
                  inputValue.trim() === ""
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "!bg-green-500 hover:!bg-green-800 !text-white !font-bold"
                }`}
                disabled={inputValue.trim() === ""}
                onClick={() => setIsOtpScreen(true)}
              >
                Continue
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
