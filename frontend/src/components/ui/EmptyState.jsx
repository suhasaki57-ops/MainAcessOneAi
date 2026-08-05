import { FiInbox } from 'react-icons/fi';

export const EmptyState = ({ title = 'No Data Found', description = 'There are no items to display right now.', icon: Icon = FiInbox, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-slate-800 my-4">
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mb-3">
        <Icon />
      </div>
      <h3 className="font-bold text-white text-base">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
