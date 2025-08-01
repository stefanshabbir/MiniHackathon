import express from "express";

import userRoutes from "./userRoutes.js";

const router = express.Router();

// Main Routes
router.use("/user", userRoutes);

export default router;
