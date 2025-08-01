export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'lecturer';
  department?: string;
}

export interface Room {
  id: string;
  name: string;
  venue: string;
  capacity: number;
  type: 'lecture' | 'seminar' | 'lab' | 'meeting';
  equipment: string[];
  location: string;
  floor: number;
  building: string;
}

export interface Booking {
  id: string;
  roomId: string;
  room?: Room;
  userId: string;
  user?: User;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  roomId: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface RoomSearchFilters {
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  capacity?: number;
  type?: string;
  building?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  booking?: Booking;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: Booking;
}