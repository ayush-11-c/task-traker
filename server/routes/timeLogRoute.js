// routes/timeLogRoute.js
import express from "express";
import {
  StartTime,
  StopTimeLog,
  GetDailySummary,
  GetTimeLogs,
} from "../controllers/timeLogController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/start", isAuth, StartTime);
router.post("/stop", isAuth, StopTimeLog);
router.get("/daily", isAuth, GetDailySummary);
router.get("/", isAuth, GetTimeLogs);

export { router as timeLogRoutes };
