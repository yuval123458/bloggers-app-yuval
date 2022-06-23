import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authReducer";

export const store = configureStore({
  reducer: { auth: authSlice },
});
