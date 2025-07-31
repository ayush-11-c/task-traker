import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", isAuth, taskRoutes);
app.use("/api/timelogs", isAuth, timeLogRoutes);

// Serve static files from React
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// Handle client-side routing
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

// Debug all registered routes (add this right before app.listen())
function printRoutes() {
  console.log("\n=== Registered Routes ===");

  // Method 1: Using express-list-endpoints (recommended)
  try {
    const listEndpoints = require("express-list-endpoints");
    console.log("Method 1: express-list-endpoints");
    console.log(listEndpoints(app));
  } catch (e) {
    console.log("express-list-endpoints not available");
  }

  // Method 2: Manual inspection
  console.log("\nMethod 2: Manual inspection");
  if (app._router?.stack) {
    app._router.stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods)
          .join(", ")
          .toUpperCase();
        console.log(`[${methods}] ${layer.route.path}`);
      } else if (layer.name === "router" && layer.handle?.stack) {
        const prefix = layer.regexp.source
          .replace("^\\", "")
          .replace("(?=\\/|$)", "")
          .replace("\\/?(?=\\/|$)", "");

        layer.handle.stack.forEach((sublayer) => {
          if (sublayer.route) {
            const methods = Object.keys(sublayer.route.methods)
              .join(", ")
              .toUpperCase();
            console.log(`[${methods}] /${prefix}${sublayer.route.path}`);
          }
        });
      }
    });
  }
}

// Print routes after they're all registered
setImmediate(printRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  printRoutes(); // Also print routes after server starts for good measure
});
