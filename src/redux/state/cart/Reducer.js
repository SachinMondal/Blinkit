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
  FETCH_CART_FAILURE,
  LOGOUT
} from "./ActionType";

const initialState = {
  cartItems: [],
  cart: [],
  totalItem: 0,
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const extractCartData = (payload = {}, payload2 = {}) => {
  // Case 1: Guest cart
  if (Array.isArray(payload)) {
    const cartItems = payload;
    const totalItem = cartItems.length;
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.count, 0);

    return {
      cartItems,
      cart: {
        cartItems,
        totalItem,
        totalQuantity,
        totalPrice: 0,
        _id: null,
        user: null,
      },
      totalItem,
      totalQuantity,
      totalPrice: 0,
    };
  }

  return {
    cartItems: payload.cartItems || [],
    cart: payload, 
    totalItem: payload.totalItem || payload.cartItems?.length || 0,
    totalQuantity: payload.totalQuantity || 0,
    totalPrice: payload.totalPrice || payload.totalCartAmount || 0,
  };
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
    case ADD_TO_CART_SUCCESS:
    case REMOVE_FROM_CART_SUCCESS:
    case UPDATE_CART_ITEM_SUCCESS: {
      const updated = extractCartData(action.payload, action.payload2);
      return {
        ...state,
        ...updated,
        loading: false,
        error: null,
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
        error: null,
      };
    
    case LOGOUT:
      return{
        ...initialState,
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
