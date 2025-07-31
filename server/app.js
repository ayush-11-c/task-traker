import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/lib.js";
import { authRoutes } from "./routes/authRoute.js";
import { taskRoutes } from "./routes/taskRoute.js";
import { timeLogRoutes } from "./routes/timeLogRoute.js";
import isAuth from "./middlewares/isAuth.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is required");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is required");
  process.exit(1);
}

const app = express();

connectDb(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", isAuth, taskRoutes);
app.use("/api/timelogs", isAuth, timeLogRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Task Tracker API");
});

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please try a different port.`
      );
      process.exit(1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
