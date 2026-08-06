import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import { historyService } from '../services/historyService';
import { useNotification } from '../context/NotificationContext';
import { FiSearch, FiStar, FiTrash2, FiEye, FiCpu, FiGlobe, FiFileText } from 'react-icons/fi';

const INITIAL_HISTORY = [
  { id: '1', title: 'Audit color contrast ratio for CTA button', category: 'Scans', date: '2026-08-05 14:22', isFav: true },
  { id: '2', title: 'Translate user interface strings into Spanish', category: 'Translations', date: '2026-08-05 11:05', isFav: false },
  { id: '3', title: 'Summarize WCAG 2.1 AA Compliance PDF', category: 'Prompts', date: '2026-08-04 18:30', isFav: true },
  { id: '4', title: 'Uploaded Product_Specification.docx OCR', category: 'Uploads', date: '2026-08-04 15:10', isFav: false },
];

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Scans':
      return FiEye;
    case 'Translations':
      return FiGlobe;
    case 'Prompts':
      return FiCpu;
    case 'Uploads':
      return FiFileText;
    default:
      return FiEye;
  }
};

const getCategoryBadgeVariant = (category) => {
  switch (category) {
    case 'Scans':
      return 'info';
    case 'Prompts':
      return 'success';
    case 'Translations':
      return 'purple';
    case 'Uploads':
      return 'warning';
    default:
      return 'info';
  }
};

export const HistoryPage = () => {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToast } = useNotification();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await historyService.getHistory({ category: activeTab, search });
      const data = res.data || res;
      if (Array.isArray(data) && data.length > 0) {
        setHistory(data);
      }
    } catch (err) {
      console.warn('Using client state for history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const toggleFavorite = async (id) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFav: !item.isFav } : item))
    );
    try {
      await historyService.toggleFavorite(id);
      addToast({ message: 'Favorite status updated!', type: 'info' });
    } catch (err) {
      addToast({ message: 'Favorite updated locally.', type: 'info' });
    }
  };

  const handleDelete = async (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try {
      await historyService.deleteHistory(id);
      addToast({ message: 'History record removed.', type: 'info' });
    } catch (err) {
      addToast({ message: 'History record removed locally.', type: 'info' });
    }
  };

  const filtered = history.filter((item) => {
    const matchesCategory = activeTab === 'All' || item.category.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Activity & Audit History</h1>
          <p className="text-sm text-slate-400 mt-1">Searchable history log of previous scans, prompts, translations, and uploads.</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'All', label: 'All Logs' },
              { id: 'Scans', label: 'Scans' },
              { id: 'Prompts', label: 'Prompts' },
              { id: 'Translations', label: 'Translations' },
              { id: 'Uploads', label: 'Uploads' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="relative w-full md:w-72">
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

        {/* Table View */}
        <Card className="p-2">
          <Table headers={['Activity Title', 'Category', 'Timestamp', 'Favorite', 'Actions']}>
            {filtered.map((item) => {
              const Icon = getCategoryIcon(item.category);
              const badgeVariant = getCategoryBadgeVariant(item.category);

              return (
                <tr key={item.id} className="hover:bg-slate-900/60 border-b border-slate-800/60 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-base shadow-sm">
                      <Icon />
                    </div>
                    <span className="text-xs text-slate-100">{item.title}</span>
                  </td>

                  {/* Category Badge */}
                  <td className="px-4 py-3.5">
                    <Badge variant={badgeVariant}>{item.category}</Badge>
                  </td>

                  {/* Timestamp */}
                  <td className="px-4 py-3.5 text-slate-400 text-xs font-mono font-medium">{item.date}</td>

                  {/* Favorite Star */}
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="p-1.5 rounded-lg text-base transition-transform active:scale-125 cursor-pointer"
                      title={item.isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FiStar className={item.isFav ? 'fill-amber-400 text-amber-400 drop-shadow-md' : 'text-slate-500 hover:text-amber-400'} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete log record"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </Table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No activity logs match the selected category filter or search query.
            </div>
          )}

          <Pagination currentPage={page} totalPages={1} onPageChange={setPage} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
