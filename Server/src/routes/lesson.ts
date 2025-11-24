import { Router, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

// Fetch all Units From the Units Table
router.get("/", async (res: Response) => {
  try {
    const units = await prisma.unit.findMany();
    return res.json({ success: true, units });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
