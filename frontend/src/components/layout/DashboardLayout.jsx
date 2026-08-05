import { useState } from 'react';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import Breadcrumb from '../ui/Breadcrumb';
import ToastContainer from '../ui/Toast';
import SkipToContent from '../accessibility/SkipToContent';
import ReadingRuler from '../accessibility/ReadingRuler';
import KeyboardShortcutsModal from '../accessibility/KeyboardShortcutsModal';
import FloatingAccessibilityToolbar from '../accessibility/FloatingAccessibilityToolbar';
import { useSettings } from '../../context/SettingsContext';
import { motion } from 'framer-motion';

export const DashboardLayout = ({ children }) => {
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white relative">
      <SkipToContent />
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Breadcrumb />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Floating Toolbar & Overlays */}
      <FloatingAccessibilityToolbar onOpenKeyboardModal={() => setIsKeyboardModalOpen(true)} />
      <ReadingRuler enabled={settings.highContrast} />
      <KeyboardShortcutsModal isOpen={isKeyboardModalOpen} onClose={() => setIsKeyboardModalOpen(false)} />
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
