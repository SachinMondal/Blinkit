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
  FETCH_ALL_USERS_REQUEST,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ALL_USERS_FAIL,
  UPDATE_ROLE_REQUEST,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  LOGOUT,
  UPDATE_USER_LOCATION_REQUEST,
  UPDATE_USER_LOCATION_SUCCESS,
  UPDATE_USER_LOCATION_FAIL,
  RESET_OTP_STATE,
} from "./ActionType";

const initialState = {
  loading: false,
  user: null,
  users: [], 
  otpSent: false,
  verified: false,
  error: null,
  token: null,
};

// Auth Reducer
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Common Loading
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case FETCH_USER_INFO_REQUEST:
    case FETCH_ALL_USERS_REQUEST:
    case UPDATE_ROLE_REQUEST:
    case UPDATE_USER_LOCATION_REQUEST:
      return { ...state, loading: true, error: null };

    // OTP
    case SEND_OTP_SUCCESS:
      return { ...state, loading: false, otpSent: true };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        otpSent: false,
        verified: true,
      };

    // Profile
    case UPDATE_PROFILE_SUCCESS:
    case FETCH_USER_INFO_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case UPDATE_USER_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        user: 
          action.payload,
        
      };
    

    // All Users
    case FETCH_ALL_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload };

    // Role Update
    case UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        ),
      };

    // Error Cases
    case SEND_OTP_FAIL:
    case VERIFY_OTP_FAIL:
    case UPDATE_PROFILE_FAIL:
    case FETCH_USER_INFO_FAIL:
    case FETCH_ALL_USERS_FAIL:
    case UPDATE_ROLE_FAIL:
    case UPDATE_USER_LOCATION_FAIL:
      return { ...state, loading: false, error: action.payload, verified: false };
    
    case RESET_OTP_STATE:
      return {
        ...state,
        otpSent:false,
        error:null,
        loading:false
      }
    // Logout
    case LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
};
