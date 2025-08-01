import { useState, useEffect } from 'react';
import { Booking } from '@/types';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Edit2, Trash2, Loader2 } from 'lucide-react';
import { format, parseISO, addDays, startOfWeek } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { EditBookingModal } from '@/components/EditBookingModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const Schedule: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await api.getBookings(user.id);
      setBookings(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.deleteBooking(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive"
      });
    }
  };

  const canModifyBooking = (booking: Booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    return bookingDateTime > oneHourFromNow;
  };

  const groupBookingsByDate = (bookings: Booking[]) => {
    const groups: { [date: string]: Booking[] } = {};
    bookings.forEach(booking => {
      if (!groups[booking.date]) {
        groups[booking.date] = [];
      }
      groups[booking.date].push(booking);
    });
    return groups;
  };

  const groupedBookings = groupBookingsByDate(bookings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">View and manage your bookings</p>
        </div>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="text-muted-foreground">View and manage your bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
            <p className="text-muted-foreground">
              You haven't made any room bookings yet. Start by searching for available rooms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBookings).map(([date, dateBookings]) => (
            <div key={date}>
              <h2 className="text-xl font-semibold mb-3">
                {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
              </h2>
              
              <div className="grid gap-4">
                {dateBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{booking.title}</CardTitle>
                          <CardDescription>{booking.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.room?.name || 'Unknown Room'}</span>
                          </div>
                          {booking.room && (
                            <div className="text-sm text-muted-foreground">
                              {booking.room.building} - {booking.room.location}
                            </div>
                          )}
                        </div>
                        
                        {booking.status === 'confirmed' && canModifyBooking(booking) && (
                          <div className="flex items-center gap-2 md:justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBooking(booking)}
                            >
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this booking? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Cancel Booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                        
                        {booking.status === 'confirmed' && !canModifyBooking(booking) && (
                          <div className="flex items-center md:justify-end">
                            <p className="text-sm text-muted-foreground">
                              Cannot modify (less than 1 hour before start)
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <EditBookingModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          booking={selectedBooking}
          onBookingUpdated={loadBookings}
        />
      )}
    </div>
  );
};