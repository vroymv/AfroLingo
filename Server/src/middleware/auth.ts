import { Request, Response, NextFunction } from "express";

/**
 * Middleware to extract userId from request headers
 * The client sends the Firebase UID in the 'x-user-id' header
 * No token verification - just extracts and validates presence
 */
export const extractUserId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "User identification required. Please login to continue.",
    });
    return;
  }

  // Attach userId to request object for use in route handlers
  (req as any).userId = userId;

  next();
};

/**
 * Optional middleware that extracts userId but doesn't require it
 * Useful for endpoints that can work with or without authentication
 */
export const optionalUserId = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const userId = req.headers["x-user-id"] as string;

  if (userId) {
    (req as any).userId = userId;
  }

  next();
};
