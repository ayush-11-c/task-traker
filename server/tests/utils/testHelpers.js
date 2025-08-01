import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../schemas/user.js";
import Task from "../../schemas/task.js";

// Test user data
export const testUsers = {
  validUser: {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  invalidEmailUser: {
    name: "Jane Doe",
    email: "invalid-email",
    password: "password123",
  },
  shortPasswordUser: {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "123",
  },
};

// Test task data
export const testTasks = {
  validTask: {
    title: "Test Task",
    description: "This is a test task description",
  },
  longTitleTask: {
    title: "A".repeat(101), // 101 characters
    description: "Valid description",
  },
  longDescriptionTask: {
    title: "Valid Title",
    description: "A".repeat(501), // 501 characters
  },
};

// Create a test user in database
export const createTestUser = async (userData = testUsers.validUser) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });
  return user;
};

// Create a test task in database
export const createTestTask = async (
  userId,
  taskData = testTasks.validTask
) => {
  const task = await Task.create({
    title: taskData.title,
    description: taskData.description,
    userId: userId,
  });
  return task;
};

// Generate JWT token for testing
export const generateTestToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Mock AI response for testing
export const mockAIResponse = {
  title: "Enhanced Test Task",
  description:
    "This is an enhanced test task description with professional formatting",
};

// Mock the generateResponse function
export const mockGenerateResponse = () => Promise.resolve(mockAIResponse);

// Helper to extract cookies from response
export const extractCookieValue = (response, cookieName) => {
  const cookies = response.headers["set-cookie"];
  if (!cookies) return null;

  const cookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));
  if (!cookie) return null;

  return cookie.split(";")[0].split("=")[1];
};

// Helper to create authenticated request headers
export const getAuthHeaders = (token) => {
  return {
    Cookie: `token=${token}`,
  };
};
