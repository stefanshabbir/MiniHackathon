import { useState, useEffect } from 'react';
import { Room, RoomSearchFilters } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Wifi, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingModal } from '@/components/BookingModal';
import { useToast } from '@/hooks/use-toast';

export const RoomSearch: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filters, setFilters] = useState<RoomSearchFilters>({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: undefined,
    type: '',
    building: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await api.getRooms();
      setRooms(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await api.getRooms(filters);
      setRooms(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search rooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const roomTypeColors = {
    lecture: 'bg-blue-100 text-blue-800',
    seminar: 'bg-green-100 text-green-800',
    lab: 'bg-purple-100 text-purple-800',
    meeting: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find Rooms</h1>
        <p className="text-muted-foreground">Search and book available classrooms</p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={filters.date}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={filters.startTime}
                onChange={(e) => setFilters(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={filters.endTime}
                onChange={(e) => setFilters(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Min Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g. 30"
                value={filters.capacity || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value ? parseInt(e.target.value) : undefined }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <Select value={filters.type || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value === 'all' ? '' : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any type</SelectItem>
                  <SelectItem value="lecture">Lecture Hall</SelectItem>
                  <SelectItem value="seminar">Seminar Room</SelectItem>
                  <SelectItem value="lab">Laboratory</SelectItem>
                  <SelectItem value="meeting">Meeting Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select value={filters.building || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, building: value === 'all' ? '' : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any building</SelectItem>
                  <SelectItem value="Main Building">Main Building</SelectItem>
                  <SelectItem value="Science Building">Science Building</SelectItem>
                  <SelectItem value="Tech Building">Tech Building</SelectItem>
                  <SelectItem value="Admin Building">Admin Building</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Results */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Rooms ({rooms.length})</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {room.building} - {room.location}
                      </CardDescription>
                    </div>
                    <Badge className={roomTypeColors[room.type] || 'bg-gray-100 text-gray-800'}>
                      {room.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Capacity: {room.capacity}
                      </span>
                      <span>Floor {room.floor}</span>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Equipment</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {room.equipment.map((item, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleBookRoom(room)} 
                      className="w-full"
                      disabled={!filters.date || !filters.startTime || !filters.endTime}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Room
                    </Button>
                    
                    {(!filters.date || !filters.startTime || !filters.endTime) && (
                      <p className="text-xs text-muted-foreground text-center">
                        Set date and time to book
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          open={showBookingModal}
          onOpenChange={setShowBookingModal}
          room={selectedRoom}
          initialDate={filters.date}
          initialStartTime={filters.startTime}
          initialEndTime={filters.endTime}
        />
      )}
    </div>
  );
};