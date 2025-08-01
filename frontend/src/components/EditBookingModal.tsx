import { useState } from 'react';
import { Booking } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  onBookingUpdated: () => void;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  open,
  onOpenChange,
  booking,
  onBookingUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    title: booking.title,
    description: booking.description || '',
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime
  });
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If time or date changed, reset availability check
    if (['date', 'startTime', 'endTime'].includes(field)) {
      setIsAvailable(null);
    }
    setError('');
  };

  const checkAvailability = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill in all date and time fields');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }

    // If no changes to time/date, automatically available
    if (
      formData.date === booking.date &&
      formData.startTime === booking.startTime &&
      formData.endTime === booking.endTime
    ) {
      setIsAvailable(true);
      return;
    }

    setCheckingAvailability(true);
    try {
      const available = await api.checkAvailability(
        booking.roomId,
        formData.date,
        formData.startTime,
        formData.endTime
      );
      setIsAvailable(available);
      if (!available) {
        setError('This time slot is already booked');
      } else {
        setError('');
      }
    } catch (err) {
      setError('Failed to check availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a title for your booking');
      return;
    }

    // Check availability if time/date changed and not already checked
    const timeOrDateChanged = 
      formData.date !== booking.date ||
      formData.startTime !== booking.startTime ||
      formData.endTime !== booking.endTime;

    if (timeOrDateChanged && isAvailable === null) {
      await checkAvailability();
      return;
    }

    if (timeOrDateChanged && isAvailable === false) {
      setError('This time slot is not available');
      return;
    }

    setLoading(true);
    try {
      await api.updateBooking(booking.id, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      
      toast({
        title: "Booking updated",
        description: "Your booking has been successfully updated",
      });
      
      onBookingUpdated();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>
            Update your booking details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Booking Title *</Label>
            <Input
              id="title"
              placeholder="e.g. CS101 Lecture"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Availability Check for time/date changes */}
          {(formData.date !== booking.date || 
            formData.startTime !== booking.startTime || 
            formData.endTime !== booking.endTime) && (
            <div className="space-y-2">
              {isAvailable === null ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={checkAvailability}
                  disabled={checkingAvailability}
                  className="w-full"
                >
                  {checkingAvailability && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Check New Time Availability
                </Button>
              ) : isAvailable ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-success">
                    New time slot is available!
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This time slot is already booked. Please choose different times.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (
                (formData.date !== booking.date || 
                 formData.startTime !== booking.startTime || 
                 formData.endTime !== booking.endTime) && 
                (isAvailable === false || isAvailable === null)
              )}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Calendar className="mr-2 h-4 w-4" />
              Update Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};