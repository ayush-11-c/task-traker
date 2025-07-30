import { Schema } from "mongoose";
import mongoose from "mongoose";
const timeLogSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
  },
  { timestamps: true }
);

const TimeLog = mongoose.model("TimeLog", timeLogSchema);

export default TimeLog;
