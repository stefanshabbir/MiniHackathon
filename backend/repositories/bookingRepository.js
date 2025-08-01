import supabase from "../config/supabase.js"

export async function getAllBookingsWithDetails() {
  const { data, error } = await supabase
    .from("booking")
    .select(`
      booking_id,
      reason,
      date,
      start_time,
      end_time,
      status,
      created_at,
      room:room_id (
        name
      ),
      user:user_id (
        full_name,
        role,
        phone
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  console.log(data);
  return data;
}
