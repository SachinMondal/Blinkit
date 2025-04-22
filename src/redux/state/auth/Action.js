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
  LOGOUT,
  FETCH_ALL_USERS_REQUEST,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ALL_USERS_FAIL,
  UPDATE_ROLE_REQUEST,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  UPDATE_USER_LOCATION_REQUEST,
  UPDATE_USER_LOCATION_SUCCESS,
  UPDATE_USER_LOCATION_FAIL,
  RESET_OTP_STATE,
} from "./ActionType";

// Send OTP
export const sendOTP = (email) => async (dispatch) => {
  try {
    dispatch({ type: SEND_OTP_REQUEST });

    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/send-otp`,
      { email }
    );

    dispatch({
      type: SEND_OTP_SUCCESS,
      payload: data.message,
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

    const { token } = getState().auth; 

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
        name: userData.name,
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
    

    dispatch({ type: "USER_INFO_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "USER_INFO_FAIL", payload: error.message });
  }
};

export const fetchAllUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_ALL_USERS_REQUEST });

    const { token } = getState().auth;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const data = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/all-users`,
      config
    );
    dispatch({
      type: FETCH_ALL_USERS_SUCCESS,
      payload: data.data.users,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ALL_USERS_FAIL,
      payload: error.response?.data?.message || "Failed to fetch users",
    });
  }
};

export const updateUserRole = (userId, role) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_ROLE_REQUEST });

    const { token } = getState().auth;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const data = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/updateRole`,
      { userId, role },
      config
    );
    dispatch({
      type: UPDATE_ROLE_SUCCESS,
      payload: data.data.user,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ROLE_FAIL,
      payload: error.response?.data?.message || "Failed to update role",
    });
  }
};

export const updateUserLocation =
  ( location,latitude, longitude) => async (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_USER_LOCATION_REQUEST });
      const token = getState().auth.token;
      const data = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/location`,
        {
          location,
          lat:latitude,
          lng:longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({
        type: UPDATE_USER_LOCATION_SUCCESS,
        payload: data.data.user,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_USER_LOCATION_FAIL,
        payload: error.response?.data?.message || "Failed to update location",
      });
    }
  };


export const resetOtpState=()=>({
  type:RESET_OTP_STATE,
});

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
