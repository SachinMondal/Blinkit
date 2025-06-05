import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./state/auth/Reducer";
import { categoryReducer } from "./state/category/Reducer";
import { productReducer } from "./state/product/Reducer";
import { bannerReducer } from "./state/home/Reducer";
import { cartReducer } from "./state/cart/Reducer";
import addressReducer from "./state/address/Reducer";
import orderReducer from "./state/order/Reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    banner: bannerReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
  },
});
