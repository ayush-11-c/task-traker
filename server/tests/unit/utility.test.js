import { sendToken, cookieOption } from "../../utils/utility.js";

// Mock dependencies manually
const mockJwt = {
  sign: (payload, secret) => "mock-jwt-token",
};

// Mock user object
const mockUser = {
  _id: "507f1f77bcf86cd799439011",
};

describe("Utility Functions Unit Tests", () => {
  describe("sendToken", () => {
    let mockRes;

    beforeEach(() => {
      mockRes = {
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        cookie: function (name, value, options) {
          this.cookieName = name;
          this.cookieValue = value;
          this.cookieOptions = options;
          return this;
        },
        json: function (data) {
          this.jsonData = data;
          return this;
        },
      };
    });

    it("should send token with correct status and cookie", () => {
      const result = sendToken(mockUser, 200, mockRes, "Success message");

      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.cookieName).toBe("token");
      expect(typeof mockRes.cookieValue).toBe("string");
      expect(mockRes.cookieValue.length).toBeGreaterThan(0);
      expect(mockRes.cookieOptions).toEqual(cookieOption);
      expect(mockRes.jsonData).toEqual({
        success: true,
        message: "Success message",
      });
    });

    it("should handle different status codes", () => {
      sendToken(mockUser, 201, mockRes, "Created successfully");

      expect(mockRes.statusCode).toBe(201);
      expect(mockRes.jsonData.message).toBe("Created successfully");
    });
  });

  describe("cookieOption", () => {
    it("should have correct cookie configuration", () => {
      expect(cookieOption).toEqual({
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    });

    it("should have maxAge of 2 days in milliseconds", () => {
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      expect(cookieOption.maxAge).toBe(twoDaysInMs);
    });

    it("should have security flags set correctly", () => {
      expect(cookieOption.httpOnly).toBe(true);
      expect(cookieOption.secure).toBe(true);
      expect(cookieOption.sameSite).toBe("None");
    });
  });
});
