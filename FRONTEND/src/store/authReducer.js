import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isLogged: false,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isLogged = true;
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: state.userId,
          token: state.token,
        })
      );
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.isLogged = false;
      localStorage.removeItem("userData");
    },
  },
});
export const authActions = authSlice.actions;

export default authSlice.reducer;
