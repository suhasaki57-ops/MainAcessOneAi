import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-800/60 border border-slate-700/30', className)}
      {...props}
    />
  );
};

export default Skeleton;
