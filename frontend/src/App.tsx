import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";

// Pages
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { RoomSearch } from "@/pages/RoomSearch";
import { Schedule } from "@/pages/Schedule";
import { Timetable } from "@/pages/Timetable";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminRooms } from "@/pages/AdminRooms";
import { AdminBookings } from "@/pages/AdminBookings";
import { Unauthorized } from "@/pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              
              {/* Lecturer routes */}
              <Route path="search" element={
                <ProtectedRoute>
                  <RoomSearch />
                </ProtectedRoute>
              } />
              <Route path="schedule" element={
                <ProtectedRoute allowedRoles={['lecturer']}>
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="timetable" element={
                <ProtectedRoute allowedRoles={['lecturer']}>
                  <Timetable />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/rooms" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRooms />
                </ProtectedRoute>
              } />
              <Route path="admin/bookings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminBookings />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
