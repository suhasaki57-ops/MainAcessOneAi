import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import AccessibilityScoreCard from '../components/accessibility/AccessibilityScoreCard';
import AccessibilityToolbar from '../components/accessibility/AccessibilityToolbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiCpu,
  FiEye,
  FiGlobe,
  FiUploadCloud,
  FiVolume2,
  FiMessageSquare,
  FiShield,
  FiCheckCircle,
  FiTrendingUp
} from 'react-icons/fi';

export const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const QUICK_ACTIONS = [
    { title: 'Upload File', path: '/upload', icon: FiUploadCloud, color: 'bg-cyan-500/10 text-cyan-400' },
    { title: 'AI Assistant', path: '/ai', icon: FiMessageSquare, color: 'bg-blue-500/10 text-blue-400' },
    { title: 'Audit Website', path: '/reports', icon: FiEye, color: 'bg-emerald-500/10 text-emerald-400' },
    { title: 'Translate Text', path: '/translation', icon: FiGlobe, color: 'bg-amber-500/10 text-amber-400' },
    { title: 'Voice Reader', path: '/voice', icon: FiVolume2, color: 'bg-purple-500/10 text-purple-400' },
  ];

  const WEEKLY_DATA = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 19 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 28 },
    { day: 'Fri', count: 22 },
    { day: 'Sat', count: 10 },
    { day: 'Sun', count: 18 },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/20 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 relative">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-semibold mb-2">
                <FiShield /> Accessibility AI Command Center
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.full_name || 'Engineer'}!
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
                Your workspace is active. 94.8% WCAG compliance rating maintained across 12 processed documents.
              </p>
            </div>
            <Link to="/upload">
              <Button size="md" className="flex items-center gap-2">
                <FiUploadCloud /> Upload New Document
              </Button>
            </Link>
          </div>
        </Card>

        {/* Global Toolbar */}
        <AccessibilityToolbar activeText="Welcome to ascess-1-ai Dashboard Command Center." />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Processed Documents" value="12" change="+3 this week" icon={FiFileText} />
          <StatCard title="WCAG Audit Rating" value="94.8%" change="AAA Grade" icon={FiEye} />
          <StatCard title="AI Operations" value="128" change="Gemini Active" icon={FiCpu} />
          <StatCard title="Languages Handled" value="12" change="Real-time translation" icon={FiGlobe} />
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="font-bold text-white text-sm mb-3">Quick Execution Grid</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {QUICK_ACTIONS.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} to={action.path}>
                  <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:scale-[1.03] transition-all border border-slate-800 hover:border-cyan-500/40 cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${action.color}`}>
                      <Icon className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {action.title}
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Middle Section: Weekly Visual Chart & Score Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-cyan-400 text-lg" />
                <h3 className="font-bold text-white text-sm">Weekly Activity & Scans</h3>
              </div>
              <Badge variant="info">Live Metrics</Badge>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-4">
              {WEEKLY_DATA.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 transition-all cursor-pointer relative group"
                    style={{ height: `${(d.count / 30) * 100}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
                      {d.count} scans
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{d.day}</span>
                </div>
              ))}
            </div>
          </Card>

          <AccessibilityScoreCard score={94.8} contrast={1} aria={0} readability={2} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
