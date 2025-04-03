import axios from "axios";
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
  CATEGORY_AND_SUBCATEGORY_REQUEST,
  CATEGORY_AND_SUBCATEGORY_FAIL,
  CATEGORY_AND_SUBCATEGORY_SUCCESS,
  CATEGORY_AND_PRODUCT_REQUEST,
  CATEGORY_AND_PRODUCT_SUCCESS,
  CATEGORY_AND_PRODUCT_FAIL,
} from "./ActionType";

const API_URL = process.env.REACT_APP_BACKEND_URL;
export const fetchCategories = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });
    const token = getState().auth.token;
    const response  = await axios.get(`${API_URL}/api/category/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: response.data.data });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const fetchCategoryById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_DETAILS_REQUEST });
    const token = getState().auth.token;

    const  data = await axios.get(`${API_URL}/api/category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: CATEGORY_DETAILS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: CATEGORY_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const addCategory = (categoryData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_ADD_REQUEST });
    const token = getState().auth.token;
    const data = await axios.post(`${API_URL}/api/category/add`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", 
        },
      });
  
    dispatch({ type: CATEGORY_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CATEGORY_ADD_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};


export const updateCategory =
  (id, categoryData) => async (dispatch, getState) => {
    try {
      dispatch({ type: CATEGORY_UPDATE_REQUEST });

      const token = getState().auth.token;

      const  data  = await axios.put(
        `${API_URL}/api/category/update/${id}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      dispatch({ type: CATEGORY_UPDATE_SUCCESS, payload: data.data.updatedCategory });
    } catch (error) {
      dispatch({
        type: CATEGORY_UPDATE_FAIL,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };


export const deleteCategory = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_DELETE_REQUEST });

    const token = getState().auth.token;

    await axios.delete(`${API_URL}/api/category/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: CATEGORY_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: CATEGORY_DELETE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const getCategoriesAndSubCategories= ()=>async (dispatch, getState)=>{
  try{
    dispatch({type:CATEGORY_AND_SUBCATEGORY_REQUEST});
    const token = getState().auth.token;
    const data = await axios.get(`${API_URL}/api/category/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({type:CATEGORY_AND_SUBCATEGORY_SUCCESS, payload: data.data.data});

  }catch(error){
    dispatch({
      type: CATEGORY_AND_SUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
}

export const getCategoryAndProduct=(categoryId)=>async(dispatch)=>{
  try{
    dispatch({type:CATEGORY_AND_PRODUCT_REQUEST});
    const data = await axios.get(`${API_URL}/api/category/subAndProd/${categoryId}`);
    dispatch({type: CATEGORY_AND_PRODUCT_SUCCESS, payload: data.data});
}catch(error){
  dispatch({
    type: CATEGORY_AND_PRODUCT_FAIL,
    payload: error.response?.data?.message || "Something went wrong",
  });
}
}