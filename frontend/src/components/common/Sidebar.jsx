import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import {
  FiGrid,
  FiUploadCloud,
  FiCpu,
  FiFileText,
  FiBarChart2,
  FiGlobe,
  FiMic,
  FiClock,
  FiSettings,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid, path: '/dashboard' },
  { id: 'upload', label: 'Upload & OCR', icon: FiUploadCloud, path: '/upload' },
  { id: 'ai', label: 'Gemini Copilot', icon: FiCpu, path: '/ai' },
  { id: 'reports', label: 'Audit Reports', icon: FiFileText, path: '/reports' },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2, path: '/analytics' },
  { id: 'translation', label: 'Translation', icon: FiGlobe, path: '/translation' },
  { id: 'voice', label: 'Voice Reader', icon: FiMic, path: '/voice' },
  { id: 'history', label: 'Activity Log', icon: FiClock, path: '/history' },
  { id: 'settings', label: 'Settings', icon: FiSettings, path: '/settings' },
];

export const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`glass-panel flex flex-col transition-all duration-300 relative z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!isCollapsed && (
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors mx-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`text-base flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
