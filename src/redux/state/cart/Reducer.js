import {
    ADD_TO_CART_REQUEST,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAILURE,
    REMOVE_FROM_CART_REQUEST,
    REMOVE_FROM_CART_SUCCESS,
    REMOVE_FROM_CART_FAILURE,
    UPDATE_CART_ITEM_REQUEST,
    UPDATE_CART_ITEM_SUCCESS,
    UPDATE_CART_ITEM_FAILURE,
    CLEAR_CART_REQUEST,
    CLEAR_CART_SUCCESS,
    CLEAR_CART_FAILURE,
    FETCH_CART_REQUEST,
    FETCH_CART_SUCCESS,
    FETCH_CART_FAILURE
} from "./ActionType";

const initialState = {
    cartItems: [],
    cart:[],
    totalItem: 0,
    totalQuantity: 0,
    totalPrice: 0,
    loading: false,
    error: null
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CART_REQUEST:
        case ADD_TO_CART_REQUEST:
        case REMOVE_FROM_CART_REQUEST:
        case UPDATE_CART_ITEM_REQUEST:
        case CLEAR_CART_REQUEST:
            return { ...state, loading: true, error: null };

        case FETCH_CART_SUCCESS:
            return {
                ...state,
                cartItems: action.payload?.cartItems || [],
                cart:action.payload2||[],
                totalItem: action.payload?.totalItem || 0,
                totalQuantity: action.payload?.totalQuantity || 0,
                totalPrice: action.payload?.totalPrice || 0,
                loading: false,
                error: null
            };
        case ADD_TO_CART_SUCCESS:
        case UPDATE_CART_ITEM_SUCCESS:
            return {
                ...state,
                cartItems: action.payload?.cartItems || [],
                totalItem: action.payload?.totalItem || 0,
                totalQuantity: action.payload?.totalQuantity || 0,
                totalPrice: action.payload?.totalPrice || 0,
                loading: false,
                error: null
            };

        case REMOVE_FROM_CART_SUCCESS:
            const updatedCart = state.cartItems.filter(
                item => !(item.productId === action.payload.productId && item.variantIndex === action.payload.variantIndex)
            );
            return {
                ...state,
                cartItems: updatedCart,
                totalItem: updatedCart.length,
                totalQuantity: updatedCart.reduce((acc, item) => acc + item.quantity, 0),
                totalPrice: updatedCart.reduce((acc, item) => acc + item.quantity * item.price, 0),
                loading: false,
                error: null
            };

        case CLEAR_CART_SUCCESS:
            return {
                ...state,
                cartItems: [],
                totalItem: 0,
                totalQuantity: 0,
                totalPrice: 0,
                loading: false,
                error: null
            };

        case FETCH_CART_FAILURE:
        case ADD_TO_CART_FAILURE:
        case REMOVE_FROM_CART_FAILURE:
        case UPDATE_CART_ITEM_FAILURE:
        case CLEAR_CART_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};