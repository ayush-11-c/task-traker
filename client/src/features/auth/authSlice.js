import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/auth/me");
      console.log("Fetched user data:", res.data.user);
      return res.data.user;
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await axios.post("/api/auth/logout");
        } catch (logoutError) {
          console.error("Failed to clear invalid session:", logoutError);
        }
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", credentials);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/api/auth/logout");
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
