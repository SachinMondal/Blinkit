import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use local storage
import { authReducer } from "./state/auth/Reducer";
import { categoryReducer } from "./state/category/Reducer";
import {productReducer} from "./state/product/Reducer";
import { bannerReducer } from "./state/home/Reducer";
const persistConfig = {
  key: "auth",
  storage, 
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    category: categoryReducer, 
    product: productReducer,
    banner:bannerReducer,
  },
});

export const persistor = persistStore(store);
