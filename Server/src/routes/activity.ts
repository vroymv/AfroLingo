import { Router, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

// Receive unitId in a post request payload and return the corresponding activities
router.post("/", async (req: any, res: Response) => {
  try {
    const { unitId } = req.body;

    console.log("Received unitId:", unitId);

    if (!unitId) {
      return res
        .status(400)
        .json({ success: false, message: "Unit ID is required" });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },

      include: {
        activities: true,
      },
    });

    if (!unit) {
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });
    }

    return res.status(200).json({ success: true, data: unit });
  } catch (error) {
    console.error("Error fetching activities for unit:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
