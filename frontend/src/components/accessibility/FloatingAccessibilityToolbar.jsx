import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { useNotification } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiZap,
  FiSun,
  FiMoon,
  FiEye,
  FiVolume2,
  FiVolumeX,
  FiMic,
  FiMicOff,
  FiHelpCircle,
  FiRotateCcw,
  FiChevronDown,
  FiChevronUp,
  FiType,
  FiMaximize2
} from 'react-icons/fi';

export const FloatingAccessibilityToolbar = ({ onOpenKeyboardModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rulerActive, setRulerActive] = useState(false);

  const { settings, updateSettings } = useSettings();
  const { themeMode, toggleTheme } = useTheme();
  const { isSpeaking, speak, stop } = useSpeechSynthesis();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
  const { addToast } = useNotification();

  useVoiceCommands(transcript, (msg) => {
    addToast({ message: `Voice Command: "${msg}"`, type: 'info' });
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleVoiceInput = () => {
    if (isListening) {
      stopListening();
      addToast({ message: 'Voice input stopped.', type: 'info' });
    } else {
      startListening();
      addToast({ message: 'Listening for voice commands...', type: 'info' });
    }
  };

  const handleToggleReadAloud = () => {
    if (isSpeaking) {
      stop();
      addToast({ message: 'Speech reader stopped.', type: 'info' });
    } else {
      speak('ascess-1-ai accessibility toolbar active. Voice features online.');
      addToast({ message: 'Reading active text aloud.', type: 'info' });
    }
  };

  const handleResetPreferences = () => {
    updateSettings({
      fontSize: 'medium',
      highContrast: false,
      dyslexiaFont: false,
      reduceMotion: false,
    });
    setRulerActive(false);
    addToast({ message: 'Accessibility preferences reset to default.', type: 'info' });
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="glass-card p-3 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col gap-2.5 w-64 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-cyan-400">
              <span className="flex items-center gap-1.5"><FiZap /> Accessibility Bar</span>
              <span className="text-[10px] text-slate-500 font-mono">Alt + A</span>
            </div>

            {/* Font Scaling */}
            <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-300 flex items-center gap-1"><FiType /> Font Size</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateSettings({ fontSize: 'small' })}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white font-bold"
                >
                  -
                </button>
                <button
                  onClick={() => updateSettings({ fontSize: 'medium' })}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                >
                  100%
                </button>
                <button
                  onClick={() => updateSettings({ fontSize: 'large' })}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dyslexia & Contrast Mode Toggles */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ dyslexiaFont: !settings.dyslexiaFont })}
                className={`p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                  settings.dyslexiaFont ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                Dyslexia Mode
              </button>

              <button
                onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                className={`p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                  settings.highContrast ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                High Contrast
              </button>
            </div>

            {/* Voice Controls */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleToggleReadAloud}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isSpeaking ? 'border-amber-500 bg-amber-500/20 text-amber-300 animate-pulse' : 'border-slate-800 bg-slate-900 text-slate-300'
                }`}
              >
                {isSpeaking ? <FiVolumeX /> : <FiVolume2 />}
                {isSpeaking ? 'Stop Read' : 'Read Aloud'}
              </button>

              <button
                onClick={handleToggleVoiceInput}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isListening ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 animate-pulse' : 'border-slate-800 bg-slate-900 text-slate-300'
                }`}
              >
                {isListening ? <FiMicOff /> : <FiMic />}
                {isListening ? 'Listening' : 'Voice Input'}
              </button>
            </div>

            {/* Reading Ruler & Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRulerActive((prev) => !prev)}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  rulerActive ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-300'
                }`}
              >
                <FiMaximize2 /> Ruler Guide
              </button>

              <button
                onClick={onOpenKeyboardModal}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-semibold"
              >
                <FiHelpCircle /> Shortcuts
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetPreferences}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5"
            >
              <FiRotateCcw /> Reset All Options
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-12 h-12 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center text-xl shadow-2xl shadow-cyan-600/40 border border-cyan-400/40 transition-all cursor-pointer"
        title="Toggle Accessibility Assistant (Alt + A)"
      >
        <FiZap />
      </button>
    </div>
  );
};

export default FloatingAccessibilityToolbar;
