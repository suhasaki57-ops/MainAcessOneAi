import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiGrid, FiUploadCloud, FiCpu, FiEye, FiGlobe, FiVolume2, FiClock, FiSettings, FiUser, FiX } from 'react-icons/fi';

const COMMANDS = [
  { id: 'dashboard', name: 'Dashboard Overview', path: '/dashboard', category: 'Navigation', icon: FiGrid },
  { id: 'upload', name: 'Upload Document / PDF / OCR', path: '/upload', category: 'Navigation', icon: FiUploadCloud },
  { id: 'ai', name: 'Gemini AI Assistant', path: '/ai', category: 'Navigation', icon: FiCpu },
  { id: 'reports', name: 'Accessibility Audit Reports', path: '/reports', category: 'Navigation', icon: FiEye },
  { id: 'translation', name: 'Language Translator', path: '/translation', category: 'Navigation', icon: FiGlobe },
  { id: 'voice', name: 'Speech Synthesis & Reader', path: '/voice', category: 'Navigation', icon: FiVolume2 },
  { id: 'history', name: 'AI & Document History Log', path: '/history', category: 'Navigation', icon: FiClock },
  { id: 'settings', name: 'Accessibility Preferences & Settings', path: '/settings', category: 'Settings', icon: FiSettings },
  { id: 'profile', name: 'User Profile & Identity', path: '/profile', category: 'Settings', icon: FiUser },
];

export const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-command-palette'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMANDS.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) || cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setSearch('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-xl glass-card rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
            <FiSearch className="text-slate-400 text-lg" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search page... (e.g. Upload, AI, Reports)"
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs"
            >
              <FiX />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No matching commands found.</div>
            ) : (
              filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.path)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-cyan-500/10 hover:border-cyan-500/20 border border-transparent transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-cyan-400 text-base group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {item.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
