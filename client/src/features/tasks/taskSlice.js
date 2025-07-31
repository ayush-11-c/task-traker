import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/tasks/getTasks");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/tasks/create", taskData);
      return response.data.task;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/tasks/update/${taskId}`, taskData);
      return response.data.task;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/tasks/delete/${taskId}`);
      return taskId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    loading: false,
    error: null,
    activeTask: null,
  },
  reducers: {
    setActiveTask: (state, action) => {
      state.activeTask = action.payload;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTask.pending, (state) => {
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      });
  },
});

export const { setActiveTask, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
