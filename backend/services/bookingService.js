import { getAllBookingsWithDetails } from "../repositories/bookingRepository.js";

export async function getFormattedBookings() {
  const bookings = await getAllBookingsWithDetails();

  return bookings.map(b => ({
    booking_id: b.booking_id,
    reason: b.reason,
    status: b.status,
    room_name: b.room?.name || "Unknown",
    user: {
      full_name: b.user?.full_name || "Unknown",
      phone: b.user?.phone || "N/A",
      role: b.user?.role || "N/A"
    },
    date: {
      day: new Date(b.date).getUTCDate(),
      month: new Date(b.date).getUTCMonth() + 1,
      year: new Date(b.date).getUTCFullYear()
    },
    start_time: b.start_time,
    end_time: b.end_time,
    created_at: b.created_at
  }));
}
