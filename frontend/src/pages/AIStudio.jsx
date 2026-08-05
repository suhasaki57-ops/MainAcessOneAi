import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PromptInput from '../components/ai/PromptInput';
import ResponseViewer from '../components/ai/ResponseViewer';
import AccessibilityToolbar from '../components/accessibility/AccessibilityToolbar';

export const AIStudio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [lastPrompt, setLastPrompt] = useState('');

  const handlePromptSubmit = (promptText) => {
    setIsLoading(true);
    setLastPrompt(promptText);

    setTimeout(() => {
      setCurrentResponse(
        `[Gemini AI Response]: Processing prompt: "${promptText}".\n\nHere is the accessibility analysis and suggested implementation:\n1. Ensure high contrast ratio (> 4.5:1).\n2. Add explicit aria-live="polite" region for dynamic content updates.\n3. Validate focus ring visibility for keyboard navigators.`
      );
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gemini AI Studio</h1>
          <p className="text-sm text-slate-400 mt-1">Generative AI assistant for accessibility fixes, summaries & translations.</p>
        </div>

        <AccessibilityToolbar activeText={currentResponse || "Gemini AI Studio active."} />

        <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} />

        <ResponseViewer response={currentResponse} prompt={lastPrompt} />
      </div>
    </DashboardLayout>
  );
};

export default AIStudio;
