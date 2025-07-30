import express from "express";
import {
  CreateTask,
  DeleteTask,
  GetTasks,
} from "../controllers/taskController.js";

const app = express.Router();

app.post("/create", CreateTask);
app.get("/getTasks", GetTasks);
app.delete("/delete/:id", DeleteTask);

export { app as taskRoutes };
