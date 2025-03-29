import {
    UPLOAD_REQUEST_REQUEST, UPLOAD_REQUEST_SUCCESS, UPLOAD_REQUEST_FAILURE,
    GET_BANNER_REQUEST, GET_BANNER_SUCCESS, GET_BANNER_FAILURE,
    DELETE_BANNER_REQUEST, DELETE_BANNER_SUCCESS, DELETE_BANNER_FAILURE
} from "./ActionType";

const initialState = {
    banners: [],
    loading: false,
    error: null,
};

export const bannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_REQUEST_REQUEST:
        case GET_BANNER_REQUEST:
        case DELETE_BANNER_REQUEST:
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

        case UPLOAD_REQUEST_FAILURE:
        case GET_BANNER_FAILURE:
        case DELETE_BANNER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};


