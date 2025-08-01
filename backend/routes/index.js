import express from "express";

import userRoutes from "./userRoutes.js";
import bookingRoutes from "./bookingRoutes.js"

const router = express.Router();

// Main Routes
router.use("/user", userRoutes);
router.use("/admin", bookingRoutes);  // /api/admin/bookings

export default router;
