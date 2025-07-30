import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./lib/lib.js";
import { authRoutes } from "./routes/authRoute.js";
import { taskRoutes } from "./routes/taskRoute.js";
import { timeLogRoutes } from "./routes/timeLogRoute.js";
import isAuth from "./middlewares/isAuth.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

connectDb(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", isAuth, taskRoutes);
app.use("/api/timelogs", isAuth, timeLogRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Task Tracker API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
