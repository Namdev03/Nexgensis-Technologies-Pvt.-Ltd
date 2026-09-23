import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginApi } from "../Api/User_Api";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const asyncLogin = createAsyncThunk(
  "user/login",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await LoginApi(payload);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Login failed"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // Login pending
    builder.addCase(asyncLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // Login success
    builder.addCase(asyncLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });

    // Login failed
    builder.addCase(asyncLogin.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    });
  },
});

export default userSlice.reducer;

