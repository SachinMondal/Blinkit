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
  FETCH_CART_FAILURE,
} from "./ActionType";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// ✅ Add to Cart (Now includes variantIndex)
export const addToCart =
  (productId, variantIndex, count) => async (dispatch, getState) => {
    const token = getState().auth.token;
    if (token) {
      try {
        dispatch({ type: ADD_TO_CART_REQUEST });
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.post(
          `${API_URL}/api/cart/addToCart`,
          { productId, variantIndex, count },
          config
        );

        const response = await axios.get(`${API_URL}/api/cart`, config);

        dispatch({ type: ADD_TO_CART_SUCCESS, payload: response.data.data });
        return response.data.success;
      } catch (error) {
        dispatch({
          type: ADD_TO_CART_FAILURE,
          payload: error.response?.data?.message || error.message,
        });
      }
    } else {
      try {
        dispatch({ type: ADD_TO_CART_REQUEST });

        const existing =
          JSON.parse(localStorage.getItem("guest_cart"))?.cartItems || [];
        const updated = [...existing];

        // 1. Fetch full product details
        const { data } = await axios.get(`${API_URL}/api/product/${productId}`);
        const product = data.data;

        // 2. Extract variant info
        const variant = product.variants[variantIndex];
        const price = parseFloat(variant.price);
        const countQty = count;

        // 3. Extract Discounts
        const productDiscount = product.productDiscount || 0;
        const categoryDiscount = product.categoryDiscount || 0;
        const totalDiscountPercent = productDiscount + categoryDiscount;

        const discountAmount = (price * totalDiscountPercent) / 100;
        const subtotalPrice = price * countQty;
        const subtotalDiscountedPrice =
          subtotalPrice - discountAmount * countQty;

        // 4. Create enriched cart item
        const cartItem = {
          _id: crypto.randomUUID(),
          product,
          variantDetails: variant,
          variantIndex,
          quantity: countQty,
          discountAmount,
          subtotalPrice,
          subtotalDiscountedPrice,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // 5. Replace or add item
        const idx = updated.findIndex(
          (item) =>
            item.product._id === productId && item.variantIndex === variantIndex
        );
        if (idx !== -1) {
          updated[idx] = cartItem;
        } else {
          updated.push(cartItem);
        }

        // 6. Compute cart totals
        const totalQuantity = updated.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalCartAmount = updated.reduce(
          (sum, item) => sum + item.subtotalPrice,
          0
        );
        const totalCartDiscountAmount = updated.reduce(
          (sum, item) => sum + item.discountAmount * item.quantity,
          0
        );
        const totalCartDiscountedPrice = updated.reduce(
          (sum, item) => sum + item.subtotalDiscountedPrice,
          0
        );


        const cartData = {
          _id: "guest-cart-id",
          user: "guest-user",
          cartItems: updated,
          totalCartSize: updated.length,
          totalCartAmount,
          totalCartDiscountAmount,
          totalCartDiscountedPrice,
          productDiscount,
          categoryDiscount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: updated.length,
        };

        localStorage.setItem("guest_cart", JSON.stringify(cartData));

        dispatch({
          type: ADD_TO_CART_SUCCESS,
          payload: cartData,
        });

        return true;
      } catch (err) {
        dispatch({ type: ADD_TO_CART_FAILURE, payload: err.message });
      }
    }
  };

export const updateCart =
  (productId, variantIndex, count) => async (dispatch, getState) => {
    const token = getState().auth.token;
    if (token) {
      try {
        dispatch({ type: UPDATE_CART_ITEM_REQUEST });

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const data = await axios.put(
          `${API_URL}/api/cart/update`,
          { productId, variantIndex, count },
          config
        );
        dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data.data.data });

        return data.data.success;
      } catch (error) {
        dispatch({
          type: UPDATE_CART_ITEM_FAILURE,
          payload: error.response?.data?.message || error.message,
        });
      }
    } else {
      try {
        dispatch({ type: UPDATE_CART_ITEM_REQUEST });

        const cart = JSON.parse(localStorage.getItem("guest_cart")) || [];

        const updated = cart.map((item) =>
          item.productId === productId && item.variantIndex === variantIndex
            ? { ...item, count }
            : item
        );

        localStorage.setItem("guest_cart", JSON.stringify(updated));
        dispatch({
          type: UPDATE_CART_ITEM_SUCCESS,
          payload: {
            cartItems: updated,
            totalItem: updated.length,
            totalQuantity: updated.reduce((sum, item) => sum + item.count, 0),
            totalPrice: 0,
          },
        });
        return true;
      } catch (err) {
        dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: err.message });
      }
    }
  };

export const removeFromCart =
  (productId, variantIndex) => async (dispatch, getState) => {
    const token = getState().auth.token;
    if (token) {
      try {
        dispatch({ type: REMOVE_FROM_CART_REQUEST });

        if (!token) throw new Error("No token found");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const data = await axios.post(
          `${API_URL}/api/cart/remove`,
          { productId, variantIndex },
          config
        );

        dispatch({ type: REMOVE_FROM_CART_SUCCESS, payload: data.data.data });
        return data.data.success;
      } catch (error) {
        dispatch({
          type: REMOVE_FROM_CART_FAILURE,
          payload: error.response?.data?.message || error.message,
        });
      }
    } else {
      try {
        dispatch({ type: REMOVE_FROM_CART_REQUEST });

        const cart = JSON.parse(localStorage.getItem("guest_cart")) || [];
        const updated = cart.filter(
          (item) =>
            !(
              item.productId === productId && item.variantIndex === variantIndex
            )
        );

        localStorage.setItem("guest_cart", JSON.stringify(updated));
        dispatch({
          type: REMOVE_FROM_CART_SUCCESS,
          payload: {
            cartItems: updated,
            totalItem: updated.length,
            totalQuantity: updated.reduce((sum, item) => sum + item.count, 0),
            totalPrice: 0,
          },
        });
        return true;
      } catch (err) {
        dispatch({ type: REMOVE_FROM_CART_FAILURE, payload: err.message });
      }
    }
  };

export const fetchCart = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  if (token) {
    try {
      dispatch({ type: FETCH_CART_REQUEST });

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const data = await axios.get(`${API_URL}/api/cart/`, config);

      dispatch({
        type: FETCH_CART_SUCCESS,
        payload: data.data.data,
        payload2: data.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_CART_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  } else {
    try {
      dispatch({ type: FETCH_CART_REQUEST });

      const cart = JSON.parse(localStorage.getItem("guest_cart")) || [];

      dispatch({
        type: FETCH_CART_SUCCESS,
        payload: {
          cartItems: cart,
          totalItem: cart.length,
          totalQuantity: cart.reduce((sum, item) => sum + item.count, 0),
          totalPrice: 0,
        },
      });
    } catch (err) {
      dispatch({ type: FETCH_CART_FAILURE, payload: err.message });
    }
  }
};

export const clearCart = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  if(token){
 try {
    dispatch({ type: CLEAR_CART_REQUEST });

    const config = { headers: { Authorization: `Bearer ${token}` } };

    await axios.delete(`${API_URL}/api/cart/clear`, config);

    dispatch({ type: CLEAR_CART_SUCCESS });
  } catch (error) {
    dispatch({
      type: CLEAR_CART_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
}else{
try{
    localStorage.removeItem("guest_cart");

      dispatch({ type: CLEAR_CART_SUCCESS });
  }catch(error){
    dispatch({
      type: CLEAR_CART_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
  }
  }


export const mergeGuestCart = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  if (!token) return;

  const guestCart = JSON.parse(localStorage.getItem("guest_cart"));
  const cartItems = guestCart?.cartItems || [];

  if (cartItems.length === 0) return;

  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    await Promise.all(
      cartItems.map((item) =>
        axios.post(`${API_URL}/api/cart/addToCart`, {
          productId: item.product._id,
          variantIndex: item.variantIndex,
          count: item.quantity,
        }, config)
      )
    );

    localStorage.removeItem("guest_cart");

    const response = await axios.get(`${API_URL}/api/cart`, config);

    dispatch({
      type: FETCH_CART_SUCCESS,
      payload: response.data.data,
      payload2: response.data,
    });
  } catch (error) {
    console.error("Error merging guest cart:", error);
  }
};

