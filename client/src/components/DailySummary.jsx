// components/DailySummary.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimeLogs } from "../features/timeLogs/timeLogSlice";

const DailySummary = () => {
  const dispatch = useDispatch();
  const { todaySummary, loading, error } = useSelector(
    (state) => state.timeLogs
  );
  const { items: tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTimeLogs());
  }, [dispatch]);

  if (loading) return <div>Loading summary...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="daily-summary">
      <h3>Today's Summary</h3>
      {todaySummary ? (
        <>
          <div className="summary-stats">
            <p>Total time tracked: {formatSeconds(todaySummary.totalTime)}</p>
            <p>Tasks worked on: {todaySummary.taskCount}</p>
            <p>
              Completed tasks:{" "}
              {tasks.filter((t) => t.status === "completed").length}
            </p>
          </div>
          <div className="task-progress">
            {tasks.map((task) => (
              <div key={task._id} className="task-progress-item">
                <span>{task.title}</span>
                <span>
                  {formatSeconds(todaySummary.taskTimes[task._id] || 0)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No activity recorded today</p>
      )}
    </div>
  );
};

const formatSeconds = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
};

export default DailySummary;
