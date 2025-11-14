import { Request, Response, NextFunction } from "express";

/**
 * Authentication middleware - extracts and validates user identification
 * Requires x-user-id header to be present
 * TODO: Implement proper Firebase JWT token verification
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Log authentication attempt
    console.log("🔐 Authentication attempt:", {
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      hasUserId: !!req.headers["x-user-id"],
    });

    // Extract userId from custom header
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      console.error("❌ No user ID provided in x-user-id header");
      return res.status(401).json({
        success: false,
        message:
          "User identification required. Please include x-user-id header.",
      });
    }

    // Validate userId is not empty
    if (userId.trim() === "") {
      console.error("❌ Empty user ID provided");
      return res.status(401).json({
        success: false,
        message: "User ID cannot be empty.",
      });
    }

    (req as any).userId = userId;

    console.log("✅ Authentication successful:", {
      userId,
    });

    return next();
  } catch (error) {
    console.error("❌ Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Alias for backwards compatibility
export const authenticateUser = verifyToken;

/**
 * Optional auth middleware - doesn't fail if no token is provided
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      console.log("✅ Optional auth - Token present");
    }

    return next();
  } catch (error) {
    // Continue even if there's an error
    return next();
  }
};
