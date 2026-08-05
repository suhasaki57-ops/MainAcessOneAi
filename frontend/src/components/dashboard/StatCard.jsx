import Card from '../ui/Card';

export const StatCard = ({ title, value, change, icon: Icon, color = 'cyan' }) => {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
        {change && <p className="text-xs text-emerald-400 mt-1 font-medium">{change}</p>}
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl">
          <Icon />
        </div>
      )}
    </Card>
  );
};

export default StatCard;
