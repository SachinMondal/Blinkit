import {
    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,
    CATEGORY_DETAILS_REQUEST,
    CATEGORY_DETAILS_SUCCESS,
    CATEGORY_DETAILS_FAIL,
    CATEGORY_ADD_REQUEST,
    CATEGORY_ADD_SUCCESS,
    CATEGORY_ADD_FAIL,
    CATEGORY_UPDATE_REQUEST,
    CATEGORY_UPDATE_SUCCESS,
    CATEGORY_UPDATE_FAIL,
    CATEGORY_DELETE_REQUEST,
    CATEGORY_DELETE_SUCCESS,
    CATEGORY_DELETE_FAIL,
    CATEGORY_AND_SUBCATEGORY_FAIL,
    CATEGORY_AND_SUBCATEGORY_SUCCESS,
    CATEGORY_AND_SUBCATEGORY_REQUEST,
    CATEGORY_AND_PRODUCT_FAIL,
    CATEGORY_AND_PRODUCT_SUCCESS,
    CATEGORY_AND_PRODUCT_REQUEST,
} from "./ActionType";

const initialState = {
    categories: [],
    category: null,
    categoryAndProduct: {
        name: "",
        subcategories: [],
    },
    loading: false,
    error: null,
};

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case CATEGORY_LIST_REQUEST:
        case CATEGORY_DETAILS_REQUEST:
        case CATEGORY_ADD_REQUEST:
        case CATEGORY_UPDATE_REQUEST:
        case CATEGORY_DELETE_REQUEST:
        case CATEGORY_AND_SUBCATEGORY_REQUEST:
        case CATEGORY_AND_PRODUCT_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null 
            };

        case CATEGORY_LIST_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                categories: Array.isArray(action.payload) ? action.payload : [] 
            };

        case CATEGORY_DETAILS_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                category: action.payload || null 
            };

        case CATEGORY_ADD_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                categories: [...(state.categories || []), action.payload] 
            };

        case CATEGORY_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: (state.categories || []).map((cat) =>
                    cat._id === action.payload._id ? action.payload : cat
                ),
            };

        case CATEGORY_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: (state.categories || []).filter((cat) => cat._id !== action.payload),
            };

        case CATEGORY_AND_SUBCATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: Array.isArray(action.payload) ? action.payload : [],
            };

        case CATEGORY_AND_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                categoryAndProduct: {
                    name: action.payload.name || "",
                    subcategories: Array.isArray(action.payload.subcategories) ? action.payload.subcategories : [],
                },
            };

        case CATEGORY_LIST_FAIL:
        case CATEGORY_DETAILS_FAIL:
        case CATEGORY_ADD_FAIL:
        case CATEGORY_UPDATE_FAIL:
        case CATEGORY_DELETE_FAIL:
        case CATEGORY_AND_SUBCATEGORY_FAIL:
        case CATEGORY_AND_PRODUCT_FAIL:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };

        default:
            return state;
    }
};
