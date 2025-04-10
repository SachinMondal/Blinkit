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
    cart: [],
    totalItem: 0,
    totalQuantity: 0,
    totalPrice: 0,
    loading: false,
    error: null
  };
  
  // Helper to extract and normalize payload
  const extractCartData = (payload = {}, payload2 = []) => ({
    cartItems: payload.cartItems || [],
    cart: payload2 || [],
    totalItem: payload.totalItem || 0,
    totalQuantity: payload.totalQuantity || 0,
    totalPrice: payload.totalPrice || 0
  });
  
  export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CART_REQUEST:
      case ADD_TO_CART_REQUEST:
      case REMOVE_FROM_CART_REQUEST:
      case UPDATE_CART_ITEM_REQUEST:
      case CLEAR_CART_REQUEST:
        return { ...state, loading: true, error: null };
  
      case FETCH_CART_SUCCESS:
      case ADD_TO_CART_SUCCESS:
      case REMOVE_FROM_CART_SUCCESS:
      case UPDATE_CART_ITEM_SUCCESS: {
        const updated = extractCartData(action.payload, action.payload2);
        return {
          ...state,
          ...updated,
          loading: false,
          error: null
        };
      }
  
      case CLEAR_CART_SUCCESS:
        return {
          ...state,
          cartItems: [],
          cart: [],
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
  