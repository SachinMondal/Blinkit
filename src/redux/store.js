import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use local storage
import { authReducer } from "./state/auth/Reducer";

const persistConfig = {
  key: "auth",
  storage, // Save auth state (including token)
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: { auth: persistedReducer },
});

export const persistor = persistStore(store);
