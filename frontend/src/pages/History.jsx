import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { FiClock, FiCpu } from 'react-icons/fi';

export const History = () => {
  const logs = [
    { id: '1', prompt: 'Audit color contrast ratio for CTA button', type: 'accessibility_fix', date: '2026-08-05 14:22' },
    { id: '2', prompt: 'Translate user interface strings into Spanish', type: 'speech_translation', date: '2026-08-05 11:05' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI & Activity History</h1>
          <p className="text-sm text-slate-400 mt-1">Audit log of previous prompts, scans, and AI operations.</p>
        </div>

        <Card>
          <div className="flex flex-col divide-y divide-slate-800">
            {logs.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                    <FiCpu />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.prompt}</h4>
                    <p className="text-xs text-slate-500 mt-0.5"><FiClock className="inline mr-1" />{item.date}</p>
                  </div>
                </div>
                <Badge variant="info">{item.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default History;
