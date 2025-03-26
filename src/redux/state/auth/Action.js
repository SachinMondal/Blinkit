import axios from "axios";
import {
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAIL,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  LOGOUT
} from "./ActionType";


// Send OTP
export const sendOTP = (email) => async (dispatch) => {
  try {
    dispatch({ type: SEND_OTP_REQUEST });

    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/send-otp`, { email });

    dispatch({
      type: SEND_OTP_SUCCESS,
      payload: data.message, // "OTP sent successfully"
    });
  } catch (error) {
    dispatch({
      type: SEND_OTP_FAIL,
      payload: error.response?.data?.message || "Failed to send OTP",
    });
  }
};
export const verifyOTP = (email, otp, navigate) => async (dispatch) => {
  try {
    dispatch({ type: VERIFY_OTP_REQUEST });

    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-otp`,
      { email, otp }
    );

    dispatch({
      type: VERIFY_OTP_SUCCESS,
      payload: { user: data.user, token: data.token }, // Store token
    });

    navigate("/profile");
  } catch (error) {
    dispatch({
      type: VERIFY_OTP_FAIL,
      payload: error.response?.data?.message || "OTP verification failed",
    });
  }
};

// Update Profile with Token from Redux
export const updateProfile = (userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const { token } = getState().auth; // Get token from Redux state

    if (!token) {
      return dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: "Unauthorized: No token provided",
      });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // ✅ Corrected object format
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/update`,
      { 
        mobileNo: userData.mobileNo, 
        name: userData.name 
      },
      config
    );

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response?.data?.message || "Profile update failed",
    });
  }
};

export const fetchUserInfo = (token) => async (dispatch) => {
  try {
    dispatch({ type: "USER_INFO_REQUEST" });

    const response = await fetch("/api/auth/info", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);

    dispatch({ type: "USER_INFO_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "USER_INFO_FAIL", payload: error.message });
  }
};


// Logout Action (Clear Redux State)
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};