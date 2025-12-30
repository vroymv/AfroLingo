import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import {
  healthRouter,
  usersRouter,
  onboardingRouter,
  unitsRouter,
  userProgressRouter,
  xpRouter,
  progressTrackerRouter,
} from "./routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use("/health", healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/units", unitsRouter);
app.use("/api/userprogress", userProgressRouter);
app.use("/api/xp", xpRouter);
app.use("/api/progress-tracker", progressTrackerRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    app.listen(PORT, () => {
      console.log(`AfroLingo Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
