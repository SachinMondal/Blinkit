import {
    ADD_PRODUCT_REQUEST,
    ADD_PRODUCT_SUCCESS,
    ADD_PRODUCT_FAILURE,
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE,
    GET_PRODUCTS_BY_CATEGORY_REQUEST,
    GET_PRODUCTS_BY_CATEGORY_SUCCESS,
    GET_PRODUCTS_BY_CATEGORY_FAILURE,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAILURE,
  } from "./ActionType";
  
  const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
  };
  
  export const productReducer = (state = initialState, action) => {
    switch (action.type) {
      // 🔹 Add Product
      case ADD_PRODUCT_REQUEST:
        return { ...state, loading: true };
      case ADD_PRODUCT_SUCCESS:
        return { ...state, loading: false, products: [...state.products, action.payload] };
      case ADD_PRODUCT_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // 🔹 Get All Products
      case GET_PRODUCTS_REQUEST:
        return { ...state, loading: true };
      case GET_PRODUCTS_SUCCESS:
        return { ...state, loading: false, products: action.payload };
      case GET_PRODUCTS_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // 🔹 Get Product by ID
      case GET_PRODUCT_BY_ID_REQUEST:
        return { ...state, loading: true };
      case GET_PRODUCT_BY_ID_SUCCESS:
        return { ...state, loading: false, product: action.payload };
      case GET_PRODUCT_BY_ID_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // 🔹 Get Products by Category ID
      case GET_PRODUCTS_BY_CATEGORY_REQUEST:
        return { ...state, loading: true };
      case GET_PRODUCTS_BY_CATEGORY_SUCCESS:
        return { ...state, loading: false, products: action.payload };
      case GET_PRODUCTS_BY_CATEGORY_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // 🔹 Update Product
      case UPDATE_PRODUCT_REQUEST:
        return { ...state, loading: true };
      case UPDATE_PRODUCT_SUCCESS:
        return {
          ...state,
          loading: false,
          products: state.products.map((prod) =>
            prod._id === action.payload._id ? action.payload : prod
          ),
        };
      case UPDATE_PRODUCT_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // 🔹 Delete Product
      case DELETE_PRODUCT_REQUEST:
        return { ...state, loading: true };
      case DELETE_PRODUCT_SUCCESS:
        return {
          ...state,
          loading: false,
          products: state.products.filter((prod) => prod._id !== action.payload),
        };
      case DELETE_PRODUCT_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  

  