import { useSpeech } from '../../hooks/useSpeech';
import { useTheme } from '../../hooks/useTheme';
import { FiVolume2, FiVolumeX, FiEye, FiZap } from 'react-icons/fi';

export const AccessibilityToolbar = ({ activeText = '' }) => {
  const { isSpeaking, speak, stopSpeaking } = useSpeech();
  const { highContrast, toggleHighContrast } = useTheme();

  return (
    <div className="glass-card rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
        <FiZap className="text-sm" /> Accessibility Controls
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => (isSpeaking ? stopSpeaking() : speak(activeText || 'ascess-1-ai accessibility toolbar active.'))}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            isSpeaking
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isSpeaking ? <FiVolumeX /> : <FiVolume2 />}
          {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
        </button>

        <button
          onClick={toggleHighContrast}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            highContrast ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <FiEye />
          High Contrast
        </button>
      </div>
    </div>
  );
};

export default AccessibilityToolbar;
