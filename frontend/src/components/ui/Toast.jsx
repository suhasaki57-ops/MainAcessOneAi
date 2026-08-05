import { useNotification } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  const icons = {
    success: <FiCheckCircle className="text-emerald-400 text-lg" />,
    error: <FiAlertCircle className="text-red-400 text-lg" />,
    info: <FiInfo className="text-cyan-400 text-lg" />,
    warning: <FiAlertCircle className="text-amber-400 text-lg" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pointer-events-auto glass-card p-4 rounded-xl border border-slate-700/80 shadow-2xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              {icons[toast.type] || icons.info}
              <p className="text-xs font-medium text-slate-200">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <FiX />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
