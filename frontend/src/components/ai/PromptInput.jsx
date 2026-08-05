import { useState } from 'react';
import Button from '../ui/Button';
import { FiSend, FiMic } from 'react-icons/fi';

export const PromptInput = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Gemini AI for accessibility fixes, translations, or summaries..."
          className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60 pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 text-lg transition-colors"
        >
          <FiMic />
        </button>
      </div>
      <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
        <FiSend />
        {isLoading ? 'Generating...' : 'Send'}
      </Button>
    </form>
  );
};

export default PromptInput;
