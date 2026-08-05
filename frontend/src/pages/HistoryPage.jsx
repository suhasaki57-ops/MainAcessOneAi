import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import { useNotification } from '../context/NotificationContext';
import { FiClock, FiSearch, FiStar, FiTrash2, FiEye, FiCpu, FiGlobe, FiFileText } from 'react-icons/fi';

const INITIAL_HISTORY = [
  { id: '1', title: 'Audit color contrast ratio for CTA button', category: 'Scans', icon: FiEye, date: '2026-08-05 14:22', isFav: true },
  { id: '2', title: 'Translate user interface strings into Spanish', category: 'Translations', icon: FiGlobe, date: '2026-08-05 11:05', isFav: false },
  { id: '3', title: 'Summarize WCAG 2.1 AA Compliance PDF', category: 'Prompts', icon: FiCpu, date: '2026-08-04 18:30', isFav: true },
  { id: '4', title: 'Uploaded Product_Specification.docx OCR', category: 'Uploads', icon: FiFileText, date: '2026-08-04 15:10', isFav: false },
];

export const HistoryPage = () => {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const { addToast } = useNotification();

  const toggleFavorite = (id) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFav: !item.isFav } : item))
    );
    addToast({ message: 'Favorite status updated!', type: 'info' });
  };

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    addToast({ message: 'History record removed.', type: 'info' });
  };

  const filtered = history.filter((item) => {
    const matchesCategory = activeTab === 'All' || item.category === activeTab;
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
              const Icon = item.icon;
              return (
                <tr key={item.id} className="hover:bg-slate-900/60 border-b border-slate-800/60">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                      <Icon />
                    </div>
                    <span>{item.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="info">{item.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{item.date}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg text-sm transition-colors ${
                        item.isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                      }`}
                    >
                      <FiStar />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </Table>

          <Pagination currentPage={page} totalPages={1} onPageChange={setPage} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
