import axios from "axios";
import {
    UPLOAD_REQUEST_REQUEST,
    UPLOAD_REQUEST_SUCCESS,
    UPLOAD_REQUEST_FAILURE,
    GET_BANNER_REQUEST,
    GET_BANNER_SUCCESS,
    GET_BANNER_FAILURE,
    DELETE_BANNER_REQUEST,
    DELETE_BANNER_SUCCESS,
    DELETE_BANNER_FAILURE
} from "./ActionType";

const API_URL = process.env.REACT_APP_BACKEND_URL;
export const uploadBanner = (formData) => async (dispatch,getState) => {
    try {
        dispatch({ type: UPLOAD_REQUEST_REQUEST });
        const token=getState().auth.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };
        const  data  = await axios.post(`${API_URL}/api/other/upload`, formData, config);
        dispatch({ type: UPLOAD_REQUEST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: UPLOAD_REQUEST_FAILURE,
            payload: error.response?.data.message || error.message,
        });
    }
};

export const getBanners = () => async (dispatch) => {
    try {
        dispatch({ type: GET_BANNER_REQUEST });
        const data  = await axios.get(`${API_URL}/api/other/banners`);
        dispatch({ type: GET_BANNER_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({
            type: GET_BANNER_FAILURE,
            payload: error.response?.data.message || error.message,
        });
    }
};

export const deleteBanner = (id) => async (dispatch,getState) => {
    try {
        dispatch({ type: DELETE_BANNER_REQUEST });
        const token=getState().auth.token;
        await axios.delete(`${API_URL}/api/other/delete/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({ type: DELETE_BANNER_SUCCESS, payload: id });
    } catch (error) {
        dispatch({
            type: DELETE_BANNER_FAILURE,
            payload: error.response?.data.message || error.message,
        });
    }
};
