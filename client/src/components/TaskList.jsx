import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  updateTask,
  deleteTask,
} from "../features/tasks/taskSlice";
import Timer from "./Timer";
import EditTaskForm from "./EditTaskForm";

const TaskList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, activeTask } = useSelector(
    (state) => state.tasks
  );
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
      } catch (err) {
        console.error("Failed to delete task:", err);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = items.find((t) => t.id === taskId);
      if (task) {
        await dispatch(
          updateTask({
            taskId,
            taskData: {
              title: task.title,
              description: task.description,
              status: newStatus,
            },
          })
        ).unwrap();
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert("Failed to update task status. Please try again.");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCloseEdit = () => {
    setEditingTask(null);
  };

  const handleEditSuccess = () => {
    console.log("Task updated successfully");
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
              key={task.id}
              className={activeTask === task.id ? "active" : ""}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <Timer taskId={task.id} />
              </div>
              <p>{task.description}</p>
              <div className="task-footer">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="task-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
                <span className="task-date">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onClose={handleCloseEdit}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default TaskList;
