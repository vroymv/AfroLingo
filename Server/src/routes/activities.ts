import express from "express";
import {
  submitActivityAnswer,
  requestActivityHint,
  skipActivity,
} from "../controllers/activitiesController";

const router = express.Router();

// POST /api/activities/:activityId/submit - Submit activity answer
router.post("/:activityId/submit", submitActivityAnswer);

// POST /api/activities/:activityId/hint - Request a hint
router.post("/:activityId/hint", requestActivityHint);

// POST /api/activities/:activityId/skip - Skip an activity
router.post("/:activityId/skip", skipActivity);

export default router;
