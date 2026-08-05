import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import { ROUTES } from '../constants';

export const GuestRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader label="Verifying authorization..." />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/profile" replace /> : <Outlet />;
};

export default GuestRoute;
