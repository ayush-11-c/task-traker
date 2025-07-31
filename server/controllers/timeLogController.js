import TimeLog from "../schemas/timeLog.js";
import Task from "../schemas/task.js";

const StartTime = async (req, res) => {
  try {
    const { taskId } = req.body;

    // Validate task exists and belongs to user
    const task = await Task.findOne({ _id: taskId, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check for active time log
    const activeLog = await TimeLog.findOne({
      userId: req.user.id,
      endTime: null,
    });

    if (activeLog) {
      return res.status(400).json({
        message: "You already have an active time log",
        activeTaskId: activeLog.taskId,
      });
    }

    const log = await TimeLog.create({
      userId: req.user.id,
      taskId: taskId,
      startTime: new Date(),
      endTime: null,
    });

    res.status(201).json({
      id: log._id,
      task: {
        id: task._id,
        title: task.title,
      },
      startTime: log.startTime,
      duration: null,
    });
  } catch (error) {
    console.error("Error in StartTime:", error);
    res
      .status(500)
      .json({ message: "Internal server error while starting time log" });
  }
};

const StopTimeLog = async (req, res) => {
  try {
    const { taskId } = req.body;
    const endTime = new Date();

    const log = await TimeLog.findOneAndUpdate(
      { userId: req.user.id, taskId: taskId, endTime: null },
      { endTime },
      { new: true }
    ).populate("taskId", "title");

    if (!log) {
      return res.status(404).json({ message: "Active time log not found" });
    }

    const duration = (endTime - log.startTime) / 1000; // in seconds

    res.status(200).json({
      message: "Time log stopped successfully",
      log: {
        id: log._id,
        task: {
          id: log.taskId._id,
          title: log.taskId.title,
        },
        startTime: log.startTime,
        endTime: log.endTime,
        duration: duration,
        formattedDuration: formatDuration(duration),
      },
    });
  } catch (error) {
    console.error("Error in StopTimeLog:", error);
    res
      .status(500)
      .json({ message: "Internal server error while stopping time log" });
  }
};

const GetDailySummary = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const logs = await TimeLog.find({
      userId: req.user.id,
      startTime: { $gte: todayStart, $lte: todayEnd },
    }).populate("taskId", "title");
    console.log("Fetched logs:", logs);

    const summary = {
      totalTime: 0,
      taskCount: 0,
      tasks: {},
      completedTasks: 0,
    };

    logs.forEach((log) => {
      const duration = (log.endTime || new Date()) - log.startTime;
      const seconds = Math.floor(duration / 1000);

      if (!summary.tasks[log.taskId?._id]) {
        summary.tasks[log.taskId?._id] = {
          title: log.taskId?.title,
          totalTime: 0,
          logs: [],
        };
      }

      summary.tasks[log.taskId._id].totalTime += seconds;
      summary.tasks[log.taskId._id].logs.push({
        startTime: log.startTime,
        endTime: log.endTime,
        duration: seconds,
      });

      summary.totalTime += seconds;
    });

    summary.taskCount = Object.keys(summary.tasks).length;

    // Get completed tasks count
    summary.completedTasks = await Task.countDocuments({
      userId: req.user.id,
      status: "completed",
      updatedAt: { $gte: todayStart, $lte: todayEnd },
    });

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Error in GetDailySummary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get daily summary",
    });
  }
};

const GetTimeLogs = async (req, res) => {
  try {
    const { startDate, endDate, taskId } = req.query;

    // Set up date filters
    const filter = { userId: req.user.id };
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate);
      if (endDate) filter.startTime.$lte = new Date(endDate);
    }
    if (taskId) filter.taskId = taskId;

    const logs = await TimeLog.find(filter)
      .populate("taskId", "title")
      .sort({ startTime: -1 });

    const formattedLogs = logs.map((log) => ({
      id: log._id,
      task: {
        id: log.taskId._id,
        title: log.taskId.title,
      },
      startTime: log.startTime,
      endTime: log.endTime,
      duration: log.endTime ? (log.endTime - log.startTime) / 1000 : null,
      formattedDuration: log.endTime
        ? formatDuration((log.endTime - log.startTime) / 1000)
        : "In Progress",
    }));

    res.json({
      success: true,
      logs: formattedLogs,
      count: logs.length,
    });
  } catch (error) {
    console.error("Error in GetTimeLogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch time logs",
    });
  }
};

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hrs > 0 ? `${hrs}h ` : ""}${mins > 0 ? `${mins}m ` : ""}${secs}s`;
}

export { StartTime, StopTimeLog, GetDailySummary, GetTimeLogs };
