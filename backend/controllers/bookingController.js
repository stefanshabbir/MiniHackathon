import { getFormattedBookings } from "../services/bookingService.js";

export async function getAllBookings(req, res) {
  try {
    const bookings = await getFormattedBookings();
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}
