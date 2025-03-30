import axios from "axios";
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

// API Base URL
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Add a new address
export const addNewAddress = (addressData,onSuccess) => async (dispatch,getState) => {
  try {
    dispatch({ type: ADD_ADDRESS_REQUEST });
    const token = getState().auth.token;
    const data  = await axios.post(`${API_BASE_URL}/api/address/add`, addressData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: ADD_ADDRESS_SUCCESS, payload: data.data });
    if(onSuccess)onSuccess();
  } catch (error) {
    dispatch({
      type: ADD_ADDRESS_FAILURE,
      payload: error.response?.data?.message || "Failed to add address",
    });
  }
};

// Edit address
export const editAddress = (addressId, updatedData,onSuccess) => async (dispatch,getState) => {
  try {
    console.log(`Edit address: ${addressId}`);
    dispatch({ type: EDIT_ADDRESS_REQUEST });
    const token = getState().auth.token;
    const  data  = await axios.put(`${API_BASE_URL}/api/address/edit/${addressId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: EDIT_ADDRESS_SUCCESS, payload: data.data.address });
    if(onSuccess)onSuccess();
  } catch (error) {
    dispatch({
      type: EDIT_ADDRESS_FAILURE,
      payload: error.response?.data?.message || "Failed to update address",
    });
  }
};

// Get all addresses
export const getAllAddresses = () => async (dispatch,getState) => {
  try {
    dispatch({ type: GET_ADDRESSES_REQUEST });
    const token = getState().auth.token;
    const  data = await axios.get(`${API_BASE_URL}/api/address/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: GET_ADDRESSES_SUCCESS, payload: data.data.addresses });
  } catch (error) {
    dispatch({
      type: GET_ADDRESSES_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch addresses",
    });
  }
};

// Delete an address
export const deleteAddress = (addressId) => async (dispatch,getState) => {
  try {
    dispatch({ type: DELETE_ADDRESS_REQUEST });
    const token = getState().auth.token;
    await axios.delete(`${API_BASE_URL}/api/address/delete/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: DELETE_ADDRESS_SUCCESS, payload: addressId });
  } catch (error) {
    dispatch({
      type: DELETE_ADDRESS_FAILURE,
      payload: error.response?.data?.message || "Failed to delete address",
    });
  }
};
