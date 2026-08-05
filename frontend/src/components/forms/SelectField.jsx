import React from 'react';
import { cn } from '../../utils/cn';

export const SelectField = React.forwardRef(
  ({ label, error, options = [], className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-semibold text-slate-300">{label}</label>}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60 transition-all bg-slate-900',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs font-medium text-red-400">{error}</span>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;
