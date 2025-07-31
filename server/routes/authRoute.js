import express from "express";
import {
  SignUp,
  login,
  logout,
  FetchMe,
} from "../controllers/authController.js";

const app = express.Router();

app.post("/signup", SignUp);
app.post("/login", login);
app.post("/logout", logout);
app.get("/me", FetchMe);

export { app as authRoutes };
