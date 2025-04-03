import axios from "axios";
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
  GET_PRODUCTS_CATEGORY_REQUEST,
  GET_PRODUCTS_CATEGORY_SUCCESS,
  GET_PRODUCTS_CATEGORY_FAILURE,
} from "./ActionType";

const API_URL = process.env.REACT_APP_BACKEND_URL 


const getAuthHeaders = (getState, isFormData = false) => {
  const token = getState().auth?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  };
};

export const addProduct = (productData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_PRODUCT_REQUEST });
    const config = getAuthHeaders(getState, true); // Set multipart/form-data

    const { data } = await axios.post(`${API_URL}/api/product/add`, productData, config);


    dispatch({ type: ADD_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_PRODUCT_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const getAllProducts = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PRODUCTS_REQUEST });
    const config = getAuthHeaders(getState);

    const {data} = await axios.get(`${API_URL}/api/product/`, config);

    dispatch({ type: GET_PRODUCTS_SUCCESS, payload: data.data});
  } catch (error) {
    dispatch({
      type: GET_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const getProductById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PRODUCT_BY_ID_REQUEST });
    const  data  = await axios.get(`${API_URL}/api/product/${id}`);
    console.log(data);
    dispatch({ type: GET_PRODUCT_BY_ID_SUCCESS, payload: data.data.data });
  } catch (error) {
    dispatch({
      type: GET_PRODUCT_BY_ID_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const getProductsByCategory = (categoryId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PRODUCTS_BY_CATEGORY_REQUEST });

    const config = getAuthHeaders(getState);
    const { data } = await axios.get(`${API_URL}/api/products/category/${categoryId}`, config);

    dispatch({ type: GET_PRODUCTS_BY_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_PRODUCTS_BY_CATEGORY_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};


export const updateProduct = (id, productData) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const config = getAuthHeaders(getState, true); 
    const data  = await axios.put(`${API_URL}/api/product/update/${id}`, productData, config)

    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};


export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const config = getAuthHeaders(getState);
    await axios.delete(`${API_URL}/api/product/delete/${id}`, config);

    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const getCategoryProduct=()=>async(dispatch ,getState)=>{
  try{
    dispatch({type: GET_PRODUCTS_CATEGORY_REQUEST});
    const config = getAuthHeaders(getState);
    const data = await axios.get(`${API_URL}/api/product/home`, config);
    dispatch({ type: GET_PRODUCTS_CATEGORY_SUCCESS, payload: data.data.categories });
  }catch(err){
    dispatch({
      type: GET_PRODUCTS_CATEGORY_FAILURE,
      payload: err.response?.data?.message || "Something went wrong",
    });
  }
}