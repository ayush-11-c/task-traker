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

export const fetchDailySummary = createAsyncThunk(
  "timeLogs/fetchDailySummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/timelogs/daily");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch daily summary"
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
      .addCase(StartTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(StartTime.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(StartTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Stop Time
      .addCase(StopTimeLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(StopTimeLog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (log) => log.id === action.payload.log.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.log;
        }
      })
      .addCase(StopTimeLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
      })

      // Fetch Daily Summary
      .addCase(fetchDailySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.todaySummary = action.payload.summary;
      })
      .addCase(fetchDailySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTimeLogError } = timeLogSlice.actions;
export default timeLogSlice.reducer;
