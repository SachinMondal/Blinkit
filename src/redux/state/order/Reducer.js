import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILURE,
  FETCH_ADMIN_ORDERS_REQUEST,
  FETCH_ADMIN_ORDERS_SUCCESS,
  FETCH_ADMIN_ORDERS_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
} from "./ActionType";

const initialState = {
  orders: [],
  adminOrders: [],
  order: null,
  loading: false,
  success: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Orders (User)
    case FETCH_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload };
    case FETCH_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Fetch Orders (Admin)
    case FETCH_ADMIN_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ADMIN_ORDERS_SUCCESS:
      return { ...state, loading: false, adminOrders: action.payload };
    case FETCH_ADMIN_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Get Order by ID
    case GET_ORDER_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ORDER_BY_ID_SUCCESS:
      return { ...state, loading: false, order: action.payload };
    case GET_ORDER_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Create Order
    case CREATE_ORDER_REQUEST:
      return { 
        ...state, 
        loading: true, 
        success: false,  // Reset success before creating order
        error: null 
      };

    case CREATE_ORDER_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        success: true, 
        order: action.payload 
      };

    case CREATE_ORDER_FAILURE:
      return { 
        ...state, 
        loading: false, 
        success: false,  // Ensure success resets on failure
        error: action.payload 
      };

    // Delete Order
    case DELETE_ORDER_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_ORDER_SUCCESS:
      return { ...state, loading: false, success: true };
    case DELETE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Update Order (Fix: Maintain immutability)
    case UPDATE_ORDER_REQUEST:
      return { ...state, loading: true, error: null };

      case UPDATE_ORDER_SUCCESS:
        return {
          ...state,
          loading: false,
          orders: state.orders.map((order) =>
            order._id === action.payload._id ? { ...action.payload } : order
          ),
          adminOrders: state.adminOrders.map((order) =>
            order._id === action.payload._id ? { ...action.payload } : order
          ),
        };
      

    case UPDATE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default orderReducer;
