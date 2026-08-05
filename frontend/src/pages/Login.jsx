import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/forms/InputField';
import Button from '../components/ui/Button';
import { useLogin } from '../hooks/useLogin';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { handleLogin, loading, error } = useLogin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('sessionExpired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password, rememberMe });
      navigate('/dashboard');
    } catch (err) {
      // Handled by hook error state
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your ascess-1-ai account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {sessionExpired && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
            Your session has expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
            {error}
          </div>
        )}

        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="demo@ascess1.ai"
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-600 focus:ring-cyan-500"
            />
            <span>Remember Me</span>
          </label>
          <Link to="/auth/forgot-password" className="text-cyan-400 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="text-center text-xs text-slate-400 mt-2">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-cyan-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
