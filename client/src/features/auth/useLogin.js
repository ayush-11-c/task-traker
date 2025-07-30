import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authSlice";

const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async (credentials) => {
    try {
      const resultAction = await dispatch(loginUser(credentials));

      if (loginUser.fulfilled.match(resultAction)) {
        // Redirect on successful login
        navigate("/", { replace: true });
        return { success: true };
      } else {
        // Return error message if login failed
        return {
          success: false,
          error: resultAction.payload || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "An unexpected error occurred during login",
      };
    }
  };
};

export default useLogin;
