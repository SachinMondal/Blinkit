import {
    ADD_ADDRESS_REQUEST,
    ADD_ADDRESS_SUCCESS,
    ADD_ADDRESS_FAILURE,
    EDIT_ADDRESS_REQUEST,
    EDIT_ADDRESS_SUCCESS,
    EDIT_ADDRESS_FAILURE,
    GET_ADDRESSES_REQUEST,
    GET_ADDRESSES_SUCCESS,
    GET_ADDRESSES_FAILURE,
    DELETE_ADDRESS_REQUEST,
    DELETE_ADDRESS_SUCCESS,
    DELETE_ADDRESS_FAILURE,
  } from "./ActionType";
  
  const initialState = {
    addresses: [],
    loading: false,
    error: null,
  };
  
  const addressReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_ADDRESS_REQUEST:
      case EDIT_ADDRESS_REQUEST:
      case GET_ADDRESSES_REQUEST:
      case DELETE_ADDRESS_REQUEST:
        return { ...state, loading: true, error: null };
  
      case ADD_ADDRESS_SUCCESS:
        return {
          ...state,
          loading: false,
          addresses: [...state.addresses, action.payload],
        };
  
      case EDIT_ADDRESS_SUCCESS:
        return {
          ...state,
          loading: false,
          addresses: state.addresses.map((address) =>
            address._id === action.payload._id ? action.payload : address
          ),
        };
  
      case GET_ADDRESSES_SUCCESS:
        return { ...state, loading: false, addresses: action.payload };
  
      case DELETE_ADDRESS_SUCCESS:
        return {
          ...state,
          loading: false,
          addresses: state.addresses.filter((address) => address._id !== action.payload),
        };
  
      case ADD_ADDRESS_FAILURE:
      case EDIT_ADDRESS_FAILURE:
      case GET_ADDRESSES_FAILURE:
      case DELETE_ADDRESS_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default addressReducer;
  