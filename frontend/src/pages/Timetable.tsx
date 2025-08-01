import React, { useState, useEffect } from 'react';
import { Booking, Room } from '@/types';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const Timetable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const { toast } = useToast();

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, roomsData] = await Promise.all([
        api.getBookings(),
        api.getRooms()
      ]);
      
      // Filter bookings for current week
      const weekBookings = bookingsData.filter(booking => {
        const bookingDate = new Date(booking.date);
        const weekEnd = addDays(currentWeek, 6);
        return bookingDate >= currentWeek && bookingDate <= weekEnd;
      });
      
      setBookings(weekBookings);
      setRooms(roomsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load timetable data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getBookingForSlot = (roomId: string, date: Date, timeSlot: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.find(booking => 
      booking.roomId === roomId &&
      booking.date === dateStr &&
      booking.startTime <= timeSlot &&
      booking.endTime > timeSlot &&
      booking.status === 'confirmed'
    );
  };

  const filteredRooms = selectedRoom === 'all' ? rooms : rooms.filter(r => r.id === selectedRoom);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">View room schedules and availability</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {rooms.map(room => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Week of {format(currentWeek, 'MMMM d, yyyy')}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(startOfWeek(new Date()))}
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timetable Grid */}
      {filteredRooms.map(room => (
        <Card key={room.id}>
          <CardHeader>
            <CardTitle className="text-lg">{room.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {room.building} - {room.location} | Capacity: {room.capacity}
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-1 min-w-[800px]">
                {/* Header row */}
                <div className="p-2 font-medium text-center">
                  <Clock className="h-4 w-4 mx-auto" />
                </div>
                {weekDays.map(day => (
                  <div key={day.toISOString()} className="p-2 font-medium text-center text-sm">
                    <div>{format(day, 'EEE')}</div>
                    <div className="text-muted-foreground">{format(day, 'M/d')}</div>
                  </div>
                ))}
                
                {/* Time slots */}
                {timeSlots.map(timeSlot => (
                  <React.Fragment key={timeSlot}>
                    <div className="p-2 font-medium text-sm text-center bg-muted/30">
                      {timeSlot}
                    </div>
                    {weekDays.map(day => {
                      const booking = getBookingForSlot(room.id, day, timeSlot);
                      return (
                        <div 
                          key={`${day.toISOString()}-${timeSlot}`}
                          className={`p-1 text-xs border rounded min-h-[60px] ${
                            booking 
                              ? 'bg-primary/10 border-primary/20' 
                              : 'bg-background hover:bg-muted/30'
                          }`}
                        >
                          {booking && (
                            <div className="p-1">
                              <div className="font-medium text-primary">
                                {booking.title}
                              </div>
                              <div className="text-muted-foreground">
                                {booking.startTime}-{booking.endTime}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No rooms to display</h3>
            <p className="text-muted-foreground">
              Select a room or view all rooms to see the timetable.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};