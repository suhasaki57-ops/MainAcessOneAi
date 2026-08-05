import Card from '../ui/Card';

export const RecentActivity = ({ activities = [] }) => {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="font-bold text-white text-base">Recent Activities</h3>
      <div className="flex flex-col divide-y divide-slate-800">
        {activities.map((item) => (
          <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">{item.action}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
            </div>
            <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
