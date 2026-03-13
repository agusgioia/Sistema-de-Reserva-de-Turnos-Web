import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const requiresOnboarding =
    session?.user?.role === 'OWNER' &&
    !session?.onboardingCompleted &&
    location.pathname !== '/onboarding';

  if (requiresOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return <Navigate to="/agenda" replace />;
  }

  return children;
}

export default ProtectedRoute;
