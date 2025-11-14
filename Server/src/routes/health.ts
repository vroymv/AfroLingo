import { Router, Request, Response } from "express";

const router = Router();

// Health check endpoint
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "AfroLingo Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
