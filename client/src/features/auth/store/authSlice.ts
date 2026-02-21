import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, IUser } from "../types";
import { tokenUtils } from "../utils/token.utils";

const initialState: AuthState = {
  user: null,
  token: tokenUtils.getToken(),
  isAuthenticated: false,
  remember: tokenUtils.shouldRemember(),
  isLoading: !!tokenUtils.getToken(),
  isInitialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUser; token: string; remember?: boolean }>,
    ) => {
      const { user, token, remember = state.remember } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.remember = remember;
      state.isInitialized = true;

      tokenUtils.setToken(token, remember);
    },
    updateToken: (
      state,
      action: PayloadAction<{ token: string; remember?: boolean }>,
    ) => {
      const { token, remember = state.remember } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.remember = remember;

      tokenUtils.setToken(token, remember);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.remember = false;
      state.isInitialized = true;
      tokenUtils.clearToken();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setInitialized,
  setError,
  updateToken,
} = authSlice.actions;
export default authSlice.reducer;
