import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const instance = axios.create({
  baseURL: BASE_URL,

  withCredentials: true,
});

// Add request interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page and not during initial auth check
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/signup") {
        // Let the auth slice handle the redirect through ProtectedRoute
        console.log(
          "Authentication error detected, will redirect through ProtectedRoute"
        );
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
