import Card from '../ui/Card';
import { FiCpu, FiCopy, FiVolume2 } from 'react-icons/fi';
import { useSpeech } from '../../hooks/useSpeech';

export const ResponseViewer = ({ response, prompt }) => {
  const { speak } = useSpeech();

  if (!response) return null;

  return (
    <Card className="flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
          <FiCpu /> Gemini AI Response
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => speak(response)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
          >
            <FiVolume2 /> Read
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(response)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
          >
            <FiCopy /> Copy
          </button>
        </div>
      </div>

      {prompt && (
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Prompt:</span> {prompt}
        </div>
      )}

      <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
        {response}
      </div>
    </Card>
  );
};

export default ResponseViewer;
