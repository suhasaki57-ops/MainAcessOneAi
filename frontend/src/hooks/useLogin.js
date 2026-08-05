import { useState } from 'react';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(credentials);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error, setError };
};

export default useLogin;
