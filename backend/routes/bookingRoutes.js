import express from "express";
import { getAllBookings } from "../controllers/bookingController.js";

const router = express.Router();

router.get("/bookings", getAllBookings); // /api/admin/bookings

export default router;
