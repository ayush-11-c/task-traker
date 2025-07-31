import Task from "../schemas/task.js";
import TimeLog from "../schemas/timeLog.js";
import { generateResponse } from "../utils/utility.js";

const CreateTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    if (title.length > 100) {
      return res
        .status(400)
        .json({ message: "Title must be less than 100 characters" });
    }

    if (description.length > 500) {
      return res
        .status(400)
        .json({ message: "Description must be less than 500 characters" });
    }
    const newRes = await generateResponse({
      title,
      description,
    });
    const newTitle = newRes.title;
    const newDescription = newRes.description;

    const newTask = await new Task({
      title: newTitle,
      description: newDescription,
      userId: req.user.id,
    }).save();

    res.status(201).json({
      message: "Task created successfully",
      task: {
        id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        createdAt: newTask.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in CreateTask:", error);
    res
      .status(500)
      .json({ message: "Internal server error while creating task" });
  }
};

const GetTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(
      tasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }))
    );
  } catch (error) {
    console.error("Error in GetTasks:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching tasks" });
  }
};

const UpdateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const taskId = req.params.id;

    // Validate status if provided
    if (status && !["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be one of: pending, in-progress, completed",
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      { title, description, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: "Task updated successfully",
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    res
      .status(500)
      .json({ message: "Internal server error while updating task" });
  }
};

const DeleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    TimeLog.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in DeleteTask:", error);
    res
      .status(500)
      .json({ message: "Internal server error while deleting task" });
  }
};

export { CreateTask, GetTasks, UpdateTask, DeleteTask };
