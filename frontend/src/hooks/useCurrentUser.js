import { useAuth } from './useAuth';

export const useCurrentUser = () => {
  const { user, loading, isAuthenticated } = useAuth();
  return { user, loading, isAuthenticated };
};

export default useCurrentUser;
