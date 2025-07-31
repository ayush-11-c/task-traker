// components/Timer.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTask } from "../features/tasks/taskSlice";
import { StartTime, StopTimeLog } from "../features/timeLogs/timeLogSlice";

const Timer = ({ taskId }) => {
  const dispatch = useDispatch();
  const { activeTask } = useSelector((state) => state.tasks);
  const { items: timeLogs, loading } = useSelector((state) => state.timeLogs);
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Check if this task has an active time log
  useEffect(() => {
    const activeLog = timeLogs.find(
      (log) => log.task?.id === taskId && !log.endTime
    );
    setIsActive(!!activeLog);
  }, [timeLogs, taskId]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = async () => {
    try {
      await dispatch(StartTime(taskId)).unwrap();
      dispatch(setActiveTask(taskId));
      setIsActive(true);
      setElapsed(0);
    } catch (err) {
      console.error("Failed to start timer:", err);
    }
  };

  const handleStop = async () => {
    try {
      await dispatch(StopTimeLog(taskId)).unwrap();
      dispatch(setActiveTask(null));
      setIsActive(false);
    } catch (err) {
      console.error("Failed to stop timer:", err);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timer">
      <div className="timer-display">{formatTime(elapsed)}</div>
      {!isActive ? (
        <button
          onClick={handleStart}
          disabled={(activeTask && activeTask !== taskId) || loading}
        >
          {loading ? "Loading..." : "Start"}
        </button>
      ) : (
        <button onClick={handleStop} disabled={loading}>
          {loading ? "Loading..." : "Stop"}
        </button>
      )}
    </div>
  );
};

export default Timer;
