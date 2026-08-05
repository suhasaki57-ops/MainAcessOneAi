import { useEffect } from 'react';
import Modal from '../ui/Modal';
import Table from '../ui/Table';

const SHORTCUTS = [
  { key: 'Ctrl + K / Cmd + K', action: 'Open Global Command Palette' },
  { key: 'Shift + ?', action: 'Open Keyboard Shortcuts Help Dialog' },
  { key: 'Alt + A', action: 'Toggle Floating Accessibility Toolbar' },
  { key: 'Tab', action: 'Navigate to Next Focusable Element' },
  { key: 'Shift + Tab', action: 'Navigate to Previous Focusable Element' },
  { key: 'Escape', action: 'Close Modal or Cancel Action' },
];

export const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-keyboard-modal'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts & Navigation Guide">
      <div className="flex flex-col gap-4">
        <p className="text-xs text-slate-400">
          ascess-1-ai supports full keyboard navigation and accessible focus rings.
        </p>
        <Table headers={['Shortcut Key Sequence', 'Action Performed']}>
          {SHORTCUTS.map((s, idx) => (
            <tr key={idx} className="border-b border-slate-800/60">
              <td className="px-4 py-2.5 font-mono text-cyan-400 text-xs">{s.key}</td>
              <td className="px-4 py-2.5 text-slate-200 text-xs font-medium">{s.action}</td>
            </tr>
          ))}
        </Table>
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsModal;
