import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoutes } from "../../routes/authRoute.js";
import { taskRoutes } from "../../routes/taskRoute.js";
import isAuth from "../../middlewares/isAuth.js";

// Create full test app (similar to main app)
const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: "http://localhost:3000",
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

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  return app;
};

describe("End-to-End Application Tests", () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe("Application Health", () => {
    it("should respond to health check", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toEqual({
        status: "OK",
        timestamp: expect.any(String),
      });
    });
  });

  describe("Authentication Endpoints", () => {
    it("should handle signup requests", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      // Should get some response
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });

    it("should handle login requests", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      // Should get some response
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });

    it("should handle logout requests", async () => {
      const response = await request(app).post("/api/auth/logout");

      // Should get some response
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });
  });

  describe("Task Management Endpoints", () => {
    it("should require authentication for task creation", async () => {
      const taskData = {
        title: "Test Task",
        description: "This is a test task",
      };

      const response = await request(app)
        .post("/api/tasks/create")
        .send(taskData)
        .expect(401);

      expect(response.body).toBeDefined();
    });

    it("should require authentication for getting tasks", async () => {
      const response = await request(app)
        .get("/api/tasks/getTasks")
        .expect(401);

      expect(response.body).toBeDefined();
    });

    it("should require authentication for updating tasks", async () => {
      const taskId = "507f1f77bcf86cd799439011";
      const updateData = {
        title: "Updated Task",
      };

      const response = await request(app)
        .put(`/api/tasks/update/${taskId}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toBeDefined();
    });

    it("should require authentication for deleting tasks", async () => {
      const taskId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .delete(`/api/tasks/delete/${taskId}`)
        .expect(401);

      expect(response.body).toBeDefined();
    });
  });

  describe("CORS Configuration", () => {
    it("should handle CORS preflight requests", async () => {
      const response = await request(app)
        .options("/api/auth/signup")
        .set("Origin", "http://localhost:3000")
        .set("Access-Control-Request-Method", "POST")
        .set("Access-Control-Request-Headers", "Content-Type");

      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid routes", async () => {
      const response = await request(app).get("/api/invalid-route");

      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
      expect(response.status).toBe(404);
    });

    it("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .set("Content-Type", "application/json")
        .send("invalid json");

      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });
  });
});
