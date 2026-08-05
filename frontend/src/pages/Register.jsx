import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/forms/InputField';
import Button from '../components/ui/Button';
import PasswordStrengthMeter from '../components/ui/PasswordStrengthMeter';
import { useRegister } from '../hooks/useRegister';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErr, setValidationErr] = useState('');

  const { handleRegister, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErr('');

    if (password !== confirmPassword) {
      setValidationErr('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setValidationErr('Password must be at least 8 characters long');
      return;
    }

    try {
      await handleRegister({ fullName, email, password, confirmPassword });
      navigate('/profile');
    } catch (err) {
      // Handled by hook error state
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join ascess-1-ai platform">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {(error || validationErr) && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
            {error || validationErr}
          </div>
        )}

        <InputField
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          required
        />

        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
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
          <PasswordStrengthMeter password={password} />
        </div>

        <InputField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <p className="text-center text-xs text-slate-400 mt-2">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-cyan-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
