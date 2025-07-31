import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import axios from "../api/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Auto-login after successful signup
      await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          type="text"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
          required
          minLength="6"
        />
        <input
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="Confirm Password"
          required
          minLength="6"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", color: "white" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "black", textDecoration: "underline" }}
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
