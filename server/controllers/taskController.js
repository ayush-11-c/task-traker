import Task from "../schemas/task.js";

const CreateTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newTask = await new Task({
      title,
      description,
      user: req.user.id,
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
    const tasks = await Task.find({ user: req.user.id });
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

const DeleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

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

export { CreateTask, GetTasks, DeleteTask };
