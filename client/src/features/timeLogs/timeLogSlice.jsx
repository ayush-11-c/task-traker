// features/timeLogs/timeLogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const StartTime = createAsyncThunk(
  "timeLogs/start",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/timelogs/start", { taskId });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to start timer"
      );
    }
  }
);

export const StopTimeLog = createAsyncThunk(
  "timeLogs/stop",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/timelogs/stop", { taskId });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to stop timer"
      );
    }
  }
);

export const fetchTimeLogs = createAsyncThunk(
  "timeLogs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/timelogs");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch time logs"
      );
    }
  }
);

const timeLogSlice = createSlice({
  name: "timeLogs",
  initialState: {
    items: [],
    loading: false,
    error: null,
    todaySummary: null,
  },
  reducers: {
    clearTimeLogError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Time
      .addCase(StartTime.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Stop Time
      .addCase(StopTimeLog.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (log) => log._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Fetch Time Logs
      .addCase(fetchTimeLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.logs;
        state.todaySummary = action.payload.summary;
      })
      .addCase(fetchTimeLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTimeLogError } = timeLogSlice.actions;
export default timeLogSlice.reducer;
