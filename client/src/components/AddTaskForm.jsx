import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../features/tasks/taskSlice";

const AddTaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createTask({ title, description })).unwrap();
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-task-form">
      <h3>Add New Task</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          maxLength="100"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          maxLength="500"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;
