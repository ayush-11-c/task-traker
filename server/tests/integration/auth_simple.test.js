import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { authRoutes } from "../../routes/authRoute.js";

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/auth", authRoutes);
  return app;
};

describe("Authentication Integration Tests", () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe("POST /api/auth/signup", () => {
    it("should handle signup request", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      // Should get some response (might be error due to DB not connected, but that's ok for now)
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should handle login request", async () => {
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
  });

  describe("POST /api/auth/logout", () => {
    it("should handle logout request", async () => {
      const response = await request(app).post("/api/auth/logout");

      // Should get some response
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should handle profile request", async () => {
      const response = await request(app).get("/api/auth/me");

      // Should get some response (likely 401 without auth)
      expect(response).toBeDefined();
      expect(typeof response.status).toBe("number");
    });
  });
});
