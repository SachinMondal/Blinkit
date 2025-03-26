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
  FETCH_USER_INFO_REQUEST,
  FETCH_USER_INFO_SUCCESS,
  FETCH_USER_INFO_FAIL,
  LOGOUT,
} from "./ActionType";

const initialState = {
  loading: false,
  user: null,
  otpSent: false,
  verified: false, // Added back the verified state
  error: null,
  token: null, // Store token in Redux state
};

// Auth Reducer
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case FETCH_USER_INFO_REQUEST:
      return { ...state, loading: true, error: null };

    case SEND_OTP_SUCCESS:
      return { ...state, loading: false, otpSent: true };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token, // Store token from response
        otpSent: false,
        verified: true, // Set verified to true
      };

    case UPDATE_PROFILE_SUCCESS:
    case FETCH_USER_INFO_SUCCESS:
      return { ...state, loading: false, user: action.payload };

    case SEND_OTP_FAIL:
    case VERIFY_OTP_FAIL:
    case UPDATE_PROFILE_FAIL:
    case FETCH_USER_INFO_FAIL:
      return { ...state, loading: false, error: action.payload, verified: false }; // Reset verified on failure

    case LOGOUT:
      return { ...initialState, token: null, verified: false }; // Reset verified on logout

    default:
      return state;
  }
};
