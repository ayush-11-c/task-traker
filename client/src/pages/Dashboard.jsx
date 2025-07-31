// pages/Dashboard.jsx
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import DailySummary from "../components/DailySummary";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Task Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>
              Welcome, {user?.name || "User"}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "var(--error-color)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="summary-section">
          <DailySummary />
        </section>
        <section className="task-form-section">
          <AddTaskForm />
        </section>
        <section className="task-list-section">
          <TaskList />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
