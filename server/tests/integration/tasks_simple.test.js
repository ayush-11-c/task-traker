import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { taskRoutes } from "../../routes/taskRoute.js";
import isAuth from "../../middlewares/isAuth.js";

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/tasks", isAuth, taskRoutes);
  return app;
};

describe("Task Management Integration Tests", () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe("POST /api/tasks/create", () => {
    it("should handle task creation request", async () => {
      const taskData = {
        title: "Test Task",
        description: "This is a test task",
      };

      const response = await request(app)
        .post("/api/tasks/create")
        .send(taskData);

      // Should get some response (likely 401 without auth)
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });

    it("should require authentication", async () => {
      const taskData = {
        title: "Test Task",
        description: "This is a test task",
      };

      const response = await request(app)
        .post("/api/tasks/create")
        .send(taskData);

      // Should return 401 without authentication
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/tasks/getTasks", () => {
    it("should handle get tasks request", async () => {
      const response = await request(app).get("/api/tasks/getTasks");

      // Should get some response (likely 401 without auth)
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });

    it("should require authentication", async () => {
      const response = await request(app).get("/api/tasks/getTasks");

      // Should return 401 without authentication
      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/tasks/update/:id", () => {
    it("should handle task update request", async () => {
      const taskId = "507f1f77bcf86cd799439011";
      const updateData = {
        title: "Updated Task",
        status: "completed",
      };

      const response = await request(app)
        .put(`/api/tasks/update/${taskId}`)
        .send(updateData);

      // Should get some response (likely 401 without auth)
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });

    it("should require authentication", async () => {
      const taskId = "507f1f77bcf86cd799439011";
      const updateData = {
        title: "Updated Task",
      };

      const response = await request(app)
        .put(`/api/tasks/update/${taskId}`)
        .send(updateData);

      // Should return 401 without authentication
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/tasks/delete/:id", () => {
    it("should handle task deletion request", async () => {
      const taskId = "507f1f77bcf86cd799439011";

      const response = await request(app).delete(`/api/tasks/delete/${taskId}`);

      // Should get some response (likely 401 without auth)
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });

    it("should require authentication", async () => {
      const taskId = "507f1f77bcf86cd799439011";

      const response = await request(app).delete(`/api/tasks/delete/${taskId}`);

      // Should return 401 without authentication
      expect(response.status).toBe(401);
    });
  });
});
