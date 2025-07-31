import express from "express";
import {
  CreateTask,
  DeleteTask,
  GetTasks,
  UpdateTask,
} from "../controllers/taskController.js";

const app = express.Router();

app.post("/create", CreateTask);
app.get("/getTasks", GetTasks);
app.put("/update/:id", UpdateTask);
app.delete("/delete/:id", DeleteTask);

export { app as taskRoutes };
