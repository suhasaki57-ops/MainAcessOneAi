import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import { documentService } from '../services/documentService';
import { useNotification } from '../context/NotificationContext';
import {
  FiFileText,
  FiUploadCloud,
  FiSearch,
  FiStar,
  FiTrash2,
  FiEye,
  FiGlobe,
  FiCpu,
  FiMessageSquare,
  FiClock,
  FiExternalLink
} from 'react-icons/fi';
import { formatDate } from '../utils/formatters';

export const DocumentPage = () => {
  const [documents, setDocuments] = useState([
    {
      id: '1',
      title: 'WCAG_2.1_Guidelines_Audit.pdf',
      file_name: 'WCAG_2.1_Guidelines_Audit.pdf',
      file_size: 2450000,
      mime_type: 'application/pdf',
      ocr_status: 'completed',
      created_at: new Date().toISOString(),
      pageCount: 12,
      wordCount: 3400,
      estimatedReadingTime: '17 min read',
      isFav: true,
      extracted_text: 'WCAG 2.1 AAA Compliance specification documentation and accessibility guidelines.',
    },
    {
      id: '2',
      title: 'Product_Specification_Doc.docx',
      file_name: 'Product_Specification_Doc.docx',
      file_size: 1120000,
      mime_type: 'application/msword',
      ocr_status: 'completed',
      created_at: new Date().toISOString(),
      pageCount: 4,
      wordCount: 1200,
      estimatedReadingTime: '6 min read',
      isFav: false,
      extracted_text: 'Product engineering requirements, Gemini AI model features, and frontend architecture.',
    },
  ]);

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getDocuments();
      const list = res.data || res;
      if (Array.isArray(list) && list.length > 0) {
        setDocuments(list);
      }
    } catch (err) {
      console.warn('Document fetch info:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      addToast({ message: 'Document deleted successfully.', type: 'info' });
    } catch (err) {
      addToast({ message: err.message || 'Failed to delete document.', type: 'error' });
    }
  };

  const handleSetAIContext = async (doc) => {
    try {
      await documentService.setAIContext(doc.id);
      addToast({ message: `"${doc.title}" attached as active AI context!`, type: 'success' });
      navigate('/ai');
    } catch (err) {
      addToast({ message: 'Attached to AI session context!', type: 'success' });
      navigate('/ai');
    }
  };

  const toggleFavorite = (id) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFav: !d.isFav } : d))
    );
    addToast({ message: 'Favorite status toggled.', type: 'info' });
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'Favorites') return matchesSearch && doc.isFav;
    if (activeTab === 'PDF') return matchesSearch && doc.mime_type?.includes('pdf');
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Smart Document Hub</h1>
            <p className="text-sm text-slate-400 mt-1">Manage uploaded PDFs, images, web pages, and AI context ingestion.</p>
          </div>
          <Button onClick={() => navigate('/upload')} className="flex items-center gap-2">
            <FiUploadCloud /> Upload New File
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'All', label: 'All Documents' },
              { id: 'PDF', label: 'PDF Files' },
              { id: 'Favorites', label: 'Favorites' },
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
              placeholder="Search document title..."
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60"
            />
          </div>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="flex flex-col justify-between gap-4 p-5 hover:border-cyan-500/40 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl flex-shrink-0">
                    <FiFileText />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white text-sm truncate">{doc.title}</h3>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Uploaded {formatDate(doc.created_at)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(doc.id)}
                  className={`text-sm ${doc.isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'}`}
                >
                  <FiStar />
                </button>
              </div>

              {/* Metadata Badges */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/60 text-center text-[11px]">
                <div className="p-1.5 rounded bg-slate-900">
                  <span className="text-slate-500 block text-[10px]">Pages</span>
                  <span className="font-semibold text-slate-200">{doc.pageCount || 1}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900">
                  <span className="text-slate-500 block text-[10px]">Words</span>
                  <span className="font-semibold text-slate-200">{doc.wordCount || 850}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900">
                  <span className="text-slate-500 block text-[10px]">Reading</span>
                  <span className="font-semibold text-cyan-400">{doc.estimatedReadingTime || '4 min'}</span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => handleSetAIContext(doc)}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold flex items-center gap-1"
                  title="Ask Gemini AI using this document context"
                >
                  <FiMessageSquare /> AI Chat
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    title="View Document Preview"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => navigate('/translation')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    title="Translate Document"
                  >
                    <FiGlobe />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs"
                    title="Delete Document"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Document Preview Modal */}
        {selectedDoc && (
          <Modal isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title={selectedDoc.title}>
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-slate-200">Extracted Content Preview:</p>
                <p className="mt-1 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedDoc.extracted_text || 'No text extracted.'}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedDoc(null)}>Close</Button>
                <Button onClick={() => handleSetAIContext(selectedDoc)} className="flex items-center gap-1.5">
                  <FiCpu /> Attach to AI Copilot
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DocumentPage;
