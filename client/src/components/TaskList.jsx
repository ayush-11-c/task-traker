// components/TaskList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTaskStatus } from "../features/tasks/taskSlice";
import Timer from "./Timer";

const TaskList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, activeTask } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap();
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>
      {items.length === 0 ? (
        <p>No tasks found. Add your first task!</p>
      ) : (
        <ul>
          {items.map((task) => (
            <li
              key={task._id}
              className={activeTask === task._id ? "active" : ""}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <Timer taskId={task._id} />
              </div>
              <p>{task.description}</p>
              <div className="task-footer">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <span className="task-date">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
