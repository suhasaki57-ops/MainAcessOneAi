import { useState } from 'react';
import { useAuth } from './useAuth';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await register(userData);
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error, setError };
};

export default useRegister;
