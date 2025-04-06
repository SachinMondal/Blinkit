import axios from "axios";
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

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    const token = getState().auth.token;
    const data = await axios.get(`${API_URL}/api/order/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data.data);
    dispatch({ type: FETCH_ORDERS_SUCCESS, payload: data.data.data });
  } catch (error) {
    dispatch({
      type: FETCH_ORDERS_FAILURE,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const createOrder =
  (cartItems, shippingAddress) => async (dispatch, getState) => {
    try {
      dispatch({ type: CREATE_ORDER_REQUEST });

      const token = getState().auth.token;
      if (!token) throw new Error("No authentication token found");
      const data = await axios.post(
        `${API_URL}/api/order/`,
        { cartItems, shippingAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({ type: CREATE_ORDER_SUCCESS, payload: data.data });
      return data.data.success;
    } catch (error) {
      console.error(
        "Order creation failed:",
        error.response?.data || error.message
      );
      dispatch({
        type: CREATE_ORDER_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const deleteOrder = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });

    await axios.delete(`/api/orders/${orderId}`);

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: orderId });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAILURE,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const updateOrder =
  (orderId, updatedData) => async (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_ORDER_REQUEST });

      const token = getState().auth?.token;

      const data = await axios.put(
        `${API_URL}/api/order/${orderId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.data.data });
    } catch (error) {
      dispatch({
        type: UPDATE_ORDER_FAILURE,
        payload: error.response?.data.message || error.message,
      });
    }
  };

export const getAllOrdersForAdmin = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_ADMIN_ORDERS_REQUEST });
    const token = getState().auth.token;
    if (!token) throw new Error("No authentication token found");
    const data = await axios.get(`${API_URL}/api/order/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: FETCH_ADMIN_ORDERS_SUCCESS, payload: data.data.data });
  } catch (error) {
    dispatch({
      type: FETCH_ADMIN_ORDERS_FAILURE,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const getOrderById = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ORDER_BY_ID_REQUEST });
    const token = getState().auth.token;
    const data = await axios.get(`${API_URL}/api/order/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: data.data.data });
  } catch (error) {
    dispatch({
      type: GET_ORDER_BY_ID_FAILURE,
      payload: error.response?.data.message || error.message,
    });
  }
};
