import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SelectField from '../components/forms/SelectField';
import { aiService } from '../services/aiService';
import { useSpeech } from '../hooks/useSpeech';
import { useNotification } from '../context/NotificationContext';
import { FiGlobe, FiRepeat, FiCopy, FiVolume2, FiDownload } from 'react-icons/fi';

const LANGUAGES = [
  { value: 'Spanish', label: 'Spanish (Español)' },
  { value: 'English', label: 'English (US)' },
  { value: 'Telugu', label: 'Telugu (తెలుగు)' },
  { value: 'Hindi', label: 'Hindi (हिंदी)' },
  { value: 'Tamil', label: 'Tamil (தமிழ்)' },
  { value: 'Kannada', label: 'Kannada (கன்னட)' },
  { value: 'Malayalam', label: 'Malayalam (മലയാളം)' },
  { value: 'Marathi', label: 'Marathi (मराठी)' },
  { value: 'Urdu', label: 'Urdu (اردو)' },
  { value: 'French', label: 'French (Français)' },
  { value: 'German', label: 'German (Deutsch)' },
  { value: 'Japanese', label: 'Japanese (日本語)' },
  { value: 'Chinese', label: 'Chinese (中文)' },
  { value: 'Arabic', label: 'Arabic (العربية)' },
];

export const TranslationPage = () => {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [sourceText, setSourceText] = useState('ascess-1-ai is an accessible, AI-powered platform for everyone.');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const { speak } = useSpeech();
  const { addToast } = useNotification();

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText || sourceText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await aiService.translate(sourceText, targetLang);
      const output = res.data?.translatedText || res.translatedText || res.data;
      setTranslatedText(output);
      addToast({ message: `Translated content into ${targetLang}!`, type: 'success' });
    } catch (err) {
      addToast({ message: err.message || 'Translation failed.', type: 'error' });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Language Translator</h1>
          <p className="text-sm text-slate-400 mt-1">Translate text across 14 languages while preserving headings and lists.</p>
        </div>

        {/* Language Selection Header */}
        <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <div className="w-full sm:w-64">
            <SelectField
              label="Source Language"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              options={LANGUAGES}
            />
          </div>

          <button
            onClick={handleSwap}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-transform active:rotate-180 mt-4 sm:mt-0"
            title="Swap Languages"
          >
            <FiRepeat className="text-lg" />
          </button>

          <div className="w-full sm:w-64">
            <SelectField
              label="Target Language"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              options={LANGUAGES}
            />
          </div>
        </Card>

        {/* Text Areas */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase">Original Text</span>
              <button
                onClick={() => speak(sourceText)}
                className="text-slate-400 hover:text-cyan-400 text-xs flex items-center gap-1"
              >
                <FiVolume2 /> Speak
              </button>
            </div>
            <textarea
              rows={8}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
          </Card>

          <Card className="flex flex-col gap-3 border border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-cyan-400 uppercase">AI Translated Output</span>
              {translatedText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speak(translatedText)}
                    className="text-slate-400 hover:text-cyan-400 text-xs flex items-center gap-1"
                  >
                    <FiVolume2 /> Speak
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(translatedText);
                      addToast({ message: 'Copied to clipboard!', type: 'info' });
                    }}
                    className="text-slate-400 hover:text-cyan-400 text-xs flex items-center gap-1"
                  >
                    <FiCopy /> Copy
                  </button>
                </div>
              )}
            </div>
            <div className="w-full text-xs text-slate-200 leading-relaxed min-h-[160px] whitespace-pre-wrap">
              {isTranslating ? (
                <span className="text-cyan-400 animate-pulse font-medium">Gemini AI is translating into {targetLang}...</span>
              ) : (
                translatedText || <span className="text-slate-500 italic">Translation output will appear here.</span>
              )}
            </div>
          </Card>
        </div>

        <Button onClick={handleTranslate} disabled={isTranslating} className="py-3">
          {isTranslating ? 'Translating via Gemini AI...' : 'Translate Content'}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default TranslationPage;
