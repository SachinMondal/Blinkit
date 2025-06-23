import {
    UPLOAD_REQUEST_REQUEST, UPLOAD_REQUEST_SUCCESS, UPLOAD_REQUEST_FAILURE,
    GET_BANNER_REQUEST, GET_BANNER_SUCCESS, GET_BANNER_FAILURE,
    DELETE_BANNER_REQUEST, DELETE_BANNER_SUCCESS, DELETE_BANNER_FAILURE,
    GET_SETTINGS_REQUEST,
    UPDATE_SETTINGS_REQUEST,
    GET_SETTINGS_SUCCESS,
    UPDATE_SETTINGS_SUCCESS,
    GET_SETTINGS_FAILURE,
    UPDATE_SETTINGS_FAILURE
} from "./ActionType";

const initialState = {
    banners: [],
    loading: false,
    error: null,
    settings:null
};

export const bannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_REQUEST_REQUEST:
        case GET_BANNER_REQUEST:
        case DELETE_BANNER_REQUEST:
        case GET_SETTINGS_REQUEST:
        case UPDATE_SETTINGS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        

        case UPLOAD_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                banners: [...state.banners, action.payload], 
            };

        case GET_BANNER_SUCCESS:
            return {
                ...state,
                loading: false,
                banners: action.payload, 
            };

        case DELETE_BANNER_SUCCESS:
            return {
                ...state,
                loading: false,
                banners: state.banners.filter(banner => banner._id !== action.payload),
            };

        case GET_SETTINGS_SUCCESS:
    case UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        settings: action.payload,
      };
        
        case UPLOAD_REQUEST_FAILURE:
        case GET_BANNER_FAILURE:
        case DELETE_BANNER_FAILURE:
             case GET_SETTINGS_FAILURE:
    case UPDATE_SETTINGS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};


