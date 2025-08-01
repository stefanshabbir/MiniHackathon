import { useState, useEffect } from 'react';
import { Room, Booking } from '@/types';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar, Users, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    utilizationRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [rooms, bookings] = await Promise.all([
        api.getRooms(),
        api.getBookings()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const activeBookings = bookings.filter(b => 
        b.date >= today && b.status === 'confirmed'
      ).length;

      setStats({
        totalRooms: rooms.length,
        totalBookings: bookings.length,
        activeBookings,
        utilizationRate: rooms.length > 0 ? Math.round((activeBookings / rooms.length) * 100) : 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: Building,
      description: 'Available rooms'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      description: 'All time bookings'
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: Users,
      description: 'Current & upcoming'
    },
    {
      title: 'Utilization Rate',
      value: `${stats.utilizationRate}%`,
      icon: TrendingUp,
      description: 'Room usage efficiency'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage rooms, bookings, and system settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Common administrative tasks
            </p>
            <div className="space-y-2">
              <a
                href="/admin/rooms"
                className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium">Manage Rooms</div>
                <div className="text-sm text-muted-foreground">Add, edit, or remove rooms</div>
              </a>
              <a
                href="/admin/bookings"
                className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium">View All Bookings</div>
                <div className="text-sm text-muted-foreground">Monitor and manage bookings</div>
              </a>
              <a
                href="/admin/settings"
                className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium">System Settings</div>
                <div className="text-sm text-muted-foreground">Configure policies and rules</div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Recent booking activity will be displayed here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};