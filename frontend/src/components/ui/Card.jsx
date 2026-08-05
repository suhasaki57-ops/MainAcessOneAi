import { cn } from '../../utils/cn';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 border border-slate-800/80 shadow-xl transition-all duration-300 hover:border-slate-700/60',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
