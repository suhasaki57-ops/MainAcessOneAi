import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/forms/InputField';
import Button from '../components/ui/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive recovery instructions">
      {submitted ? (
        <div className="text-center flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
            Password reset link has been dispatched to <span className="font-bold">{email}</span>.
          </div>
          <Link to="/auth/login">
            <Button variant="secondary" className="w-full">Return to Sign In</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
          <Button type="submit" className="w-full mt-2">
            Send Reset Instructions
          </Button>
          <p className="text-center text-xs text-slate-400 mt-2">
            Remembered your password?{' '}
            <Link to="/auth/login" className="text-cyan-400 font-semibold hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
