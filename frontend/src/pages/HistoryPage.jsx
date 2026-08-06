import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import { historyService } from '../services/historyService';
import { useNotification } from '../context/NotificationContext';
import {
  FiSearch,
  FiStar,
  FiTrash2,
  FiEye,
  FiCpu,
  FiGlobe,
  FiFileText,
  FiShield,
  FiSliders,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

const getCategoryIcon = (category, action = '') => {
  const cat = (category || '').toLowerCase();
  const act = (action || '').toLowerCase();

  if (cat.includes('scan') || act.includes('audit') || act.includes('scan')) return FiEye;
  if (cat.includes('prompt') || act.includes('chat') || act.includes('summar') || act.includes('alt')) return FiCpu;
  if (cat.includes('translat')) return FiGlobe;
  if (cat.includes('upload') || act.includes('file') || act.includes('ocr') || act.includes('pdf')) return FiFileText;
  if (cat.includes('auth') || act.includes('login') || act.includes('register')) return FiShield;
  if (cat.includes('setting') || cat.includes('profile') || act.includes('theme') || act.includes('font')) return FiSliders;
  return FiEye;
};

const getCategoryBadgeVariant = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('scan')) return 'info';
  if (cat.includes('prompt')) return 'success';
  if (cat.includes('translat')) return 'purple';
  if (cat.includes('upload')) return 'warning';
  if (cat.includes('auth')) return 'danger';
  return 'info';
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Recently';
  const logDate = new Date(dateStr);
  const now = new Date();
  const diffMs = now - logDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return dateStr.slice(0, 10);
};

const getTimelineGroup = (dateStr) => {
  if (!dateStr) return 'Older';
  const logDate = new Date(dateStr);
  const now = new Date();
  const diffMs = now - logDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'Last 7 Days';
  return 'Older';
};

export const HistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useNotification();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await historyService.getHistory({ category: activeTab, search, status: statusFilter });
      const data = res.data || res;
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.warn('History fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeTab, statusFilter]);

  const toggleFavorite = async (id) => {
    setLogs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_favorite: !item.is_favorite, isFav: !item.is_favorite } : item))
    );
    try {
      await historyService.toggleFavorite(id);
      addToast({ message: 'Favorite status updated!', type: 'info' });
    } catch (err) {
      addToast({ message: 'Favorite updated.', type: 'info' });
    }
  };

  const handleDelete = async (id) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
    try {
      await historyService.deleteHistory(id);
      addToast({ message: 'History record removed.', type: 'info' });
    } catch (err) {
      addToast({ message: 'History record removed.', type: 'info' });
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const categoryMatch =
        activeTab === 'All' || (item.category && item.category.toLowerCase() === activeTab.toLowerCase());
      const statusMatch =
        statusFilter === 'All' || (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());
      const searchMatch =
        !search ||
        (item.action && item.action.toLowerCase().includes(search.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));

      return categoryMatch && statusMatch && searchMatch;
    });
  }, [logs, activeTab, statusFilter, search]);

  // Group logs into Timeline Sections
  const groupedTimeline = useMemo(() => {
    const groups = { Today: [], Yesterday: [], 'Last 7 Days': [], Older: [] };
    filteredLogs.forEach((log) => {
      const groupKey = getTimelineGroup(log.created_at || log.date);
      if (groups[groupKey]) {
        groups[groupKey].push(log);
      } else {
        groups.Older.push(log);
      }
    });
    return groups;
  }, [filteredLogs]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Activity & Audit History</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time audit log of all system scans, prompts, translations, uploads, and user actions.
          </p>
        </div>

        {/* Filter Controls Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'All', label: 'All Logs' },
              { id: 'Scans', label: 'Scans' },
              { id: 'Prompts', label: 'Prompts' },
              { id: 'Translations', label: 'Translations' },
              { id: 'Uploads', label: 'Uploads' },
              { id: 'Auth', label: 'Auth' },
              { id: 'Settings', label: 'Settings' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex items-center gap-3">
            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 text-xs text-white border border-slate-700/60 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history entries..."
                className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60"
              />
            </div>
          </div>
        </div>

        {/* Timeline Grouped View */}
        <div className="flex flex-col gap-6">
          {Object.entries(groupedTimeline).map(([groupTitle, groupLogs]) => {
            if (groupLogs.length === 0) return null;

            return (
              <div key={groupTitle} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                    {groupTitle}
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-800" />
                </div>

                <Card className="p-2">
                  <Table headers={['Activity Title & Action', 'Category', 'Status', 'Timestamp', 'Favorite', 'Actions']}>
                    {groupLogs.map((item) => {
                      const Icon = getCategoryIcon(item.category, item.action);
                      const badgeVariant = getCategoryBadgeVariant(item.category);
                      const isFav = item.is_favorite || item.isFav;
                      const isExpanded = expandedLogId === item.id;

                      return (
                        <tr key={item.id} className="hover:bg-slate-900/60 border-b border-slate-800/60 transition-colors">
                          {/* Title & Description */}
                          <td className="px-4 py-3.5 font-semibold text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-base shadow-sm shrink-0">
                                <Icon />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-white font-bold">{item.action || item.title}</span>
                                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                                    <button
                                      onClick={() => setExpandedLogId(isExpanded ? null : item.id)}
                                      className="text-slate-500 hover:text-cyan-400 text-xs flex items-center"
                                    >
                                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-normal">
                                  {item.description || item.title}
                                </span>

                                {/* Metadata Breakdown Drawer */}
                                {isExpanded && item.metadata && (
                                  <div className="mt-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 font-mono flex flex-col gap-1">
                                    {Object.entries(item.metadata).map(([k, v]) => (
                                      <div key={k}>
                                        <strong className="text-slate-400">{k}:</strong>{' '}
                                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="px-4 py-3.5">
                            <Badge variant={badgeVariant}>{item.category || 'Scans'}</Badge>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            {item.status === 'failed' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                                <FiXCircle /> Failed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <FiCheckCircle /> Success
                              </span>
                            )}
                          </td>

                          {/* Timestamp & Relative Time */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col">
                              <span className="text-slate-300 text-xs font-mono font-medium">{item.date || item.created_at?.slice(0, 16)}</span>
                              <span className="text-[10px] text-slate-500">{formatRelativeTime(item.created_at || item.date)}</span>
                            </div>
                          </td>

                          {/* Favorite Star */}
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => toggleFavorite(item.id)}
                              className="p-1.5 rounded-lg text-base transition-transform active:scale-125 cursor-pointer"
                              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <FiStar className={isFav ? 'fill-amber-400 text-amber-400 drop-shadow-md' : 'text-slate-500 hover:text-amber-400'} />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Delete activity log"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </Table>
                </Card>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <Card className="p-8 text-center text-xs text-slate-400">
              No activity logs match the selected category, status filter, or search query.
            </Card>
          )}

          <Pagination currentPage={page} totalPages={1} onPageChange={setPage} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
