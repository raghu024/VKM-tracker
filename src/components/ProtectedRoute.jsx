import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useUserStore } from '../stores/useUserStore.js';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const { profile } = useUserStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="text-gold animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
