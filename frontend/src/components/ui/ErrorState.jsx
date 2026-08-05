import { FiAlertTriangle } from 'react-icons/fi';
import Button from './Button';

export const ErrorState = ({ title = 'Something went wrong', description = 'An unexpected error occurred. Please try again.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-card rounded-2xl border border-red-500/20 bg-red-500/5 my-4">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-3">
        <FiAlertTriangle />
      </div>
      <h3 className="font-bold text-white text-base">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
