import bcrypt from "bcrypt";
import { sendToken } from "../utils/utility.js";
import User from "../schemas/user.js";

const SignUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Input validation
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      email,
      name,
      password: hashedPassword,
    }).save();

    sendToken(user, 201, res, "User registered successfully");
  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).json({ message: "Internal server error while signing up" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendToken(user, 200, res, "User logged in successfully");
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error while logging in" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res
      .status(500)
      .json({ message: "Internal server error while logging out" });
  }
};

const FetchMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send password back
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error("Error in FetchMe:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching user" });
  }
};

export { SignUp, login, logout, FetchMe };
