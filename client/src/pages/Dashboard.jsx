// pages/Dashboard.jsx
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import DailySummary from "../components/DailySummary";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header>
        <h1>Task Dashboard</h1>
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
