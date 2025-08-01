import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/search" replace />;
  }
};