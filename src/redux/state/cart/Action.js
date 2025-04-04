import axios from "axios";
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

const API_URL = process.env.REACT_APP_BACKEND_URL;

// ✅ Add to Cart (Now includes variantIndex)
export const addToCart = (productId, variantIndex,count) => async (dispatch, getState) => {
    try {
        dispatch({ type: ADD_TO_CART_REQUEST });
        const token = getState().auth.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log(productId,variantIndex,count);
        const  data  = await axios.post(
            `${API_URL}/api/cart/addToCart`,
            { productId, variantIndex,count },
            config
        );
        dispatch({ type: ADD_TO_CART_SUCCESS, payload: data.data.data });
        return data.data.success;
    } catch (error) {
        dispatch({ type: ADD_TO_CART_FAILURE, payload: error.response?.data?.message || error.message });
    }
};

// ✅ Update Cart Item (Now updates a specific variant)
export const updateCart = (productId, variantIndex, count) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_CART_ITEM_REQUEST });

        const token = getState().auth.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const  data  = await axios.put(
            `${API_URL}/api/cart/update`,
            { productId, variantIndex, count },
            config
        );
        dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data.data.data });
        console.log(data.data.data.success);
        return data.data.success;
    } catch (error) {
        dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.response?.data?.message || error.message });
    }
};

// ✅ Remove from Cart
export const removeFromCart = (productId, variantIndex) => async (dispatch, getState) => {
    try {
        dispatch({ type: REMOVE_FROM_CART_REQUEST });

        const token = getState().auth.token;
        if (!token) throw new Error("No token found");

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };
        const  data  = await axios.post(`${API_URL}/api/cart/remove`, { productId, variantIndex }, config);

        

        dispatch({ type: REMOVE_FROM_CART_SUCCESS, payload: data.data.data });
        return data.data.success;
    } catch (error) {
        dispatch({ 
            type: REMOVE_FROM_CART_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};


// ✅ Fetch Cart
export const fetchCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: FETCH_CART_REQUEST });

        const token = getState().auth.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const data = await axios.get(`${API_URL}/api/cart/`, config)

        dispatch({ type: FETCH_CART_SUCCESS, payload: data.data.data,payload2:data.data });
    } catch (error) {
        dispatch({ type: FETCH_CART_FAILURE, payload: error.response?.data?.message || error.message });
    }
};

// ✅ Clear Cart
export const clearCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CLEAR_CART_REQUEST });

        const token = getState().auth.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.delete(`${API_URL}/api/cart/clear`, config);

        dispatch({ type: CLEAR_CART_SUCCESS });
    } catch (error) {
        dispatch({ type: CLEAR_CART_FAILURE, payload: error.response?.data?.message || error.message });
    }
};