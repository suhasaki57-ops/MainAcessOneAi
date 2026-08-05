import React from 'react';
import { cn } from '../../utils/cn';

export const InputField = React.forwardRef(
  ({ label, error, type = 'text', className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-semibold text-slate-300">{label}</label>}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60 transition-all',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-medium text-red-400">{error}</span>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
