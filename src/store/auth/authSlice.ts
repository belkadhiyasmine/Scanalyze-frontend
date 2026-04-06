import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userName: string | null;
  userRole: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token:    localStorage.getItem("token"),
  userName: localStorage.getItem("userName"),
  userRole: localStorage.getItem("userRole"),
  isLoading: false,
  error:    null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state, _action: PayloadAction<{ email: string; password: string }>) {
      state.isLoading = true;
      state.error     = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; userName: string; userRole: string }>) {
      state.isLoading = false;
      state.token     = action.payload.token;
      state.userName  = action.payload.userName;
      state.userRole  = action.payload.userRole;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error     = action.payload;
    },
    logout(state) {
      state.token    = null;
      state.userName = null;
      state.userRole = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;