import express from "express";
import {
  startLesson,
  completeLesson,
  getLessonProgress,
  getLessonSessions,
} from "../controllers/lessonsController";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// POST /api/lessons/:lessonId/start - Start or resume a lesson
router.post("/:lessonId/start", startLesson);

// POST /api/lessons/:lessonId/complete - Complete a lesson
router.post("/:lessonId/complete", completeLesson);

// GET /api/lessons/:lessonId/progress - Get lesson progress
router.get("/:lessonId/progress", getLessonProgress);

// GET /api/lessons/:lessonId/sessions - Get session history
router.get("/:lessonId/sessions", getLessonSessions);

export default router;
