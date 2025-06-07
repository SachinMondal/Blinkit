import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { authReducer } from "./state/auth/Reducer";
import { categoryReducer } from "./state/category/Reducer";
import { productReducer } from "./state/product/Reducer";
import { bannerReducer } from "./state/home/Reducer";
import { cartReducer } from "./state/cart/Reducer";
import addressReducer from "./state/address/Reducer";
import orderReducer from "./state/order/Reducer";
import uiReducer from "./state/ui/Reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  banner: bannerReducer,
  cart: cartReducer,
  address: addressReducer,
  order: orderReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
