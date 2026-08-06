import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { aiService } from '../services/aiService';
import { useNotification } from '../context/NotificationContext';
import { FiCpu, FiSend, FiPaperclip, FiMic, FiUser, FiPlus, FiMessageSquare, FiTrash2, FiRotateCcw, FiCopy, FiFileText, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const SUGGESTIONS = [
  'Summarize my document',
  'Translate this page',
  'Explain this paragraph',
  'Check accessibility',
  'Generate alt text',
  'Improve readability',
];

const INITIAL_WELCOME_MSG = `👋 Welcome to ascess-1-ai.

I'm your AI Accessibility Assistant.

I can help you:
• Analyze documents
• Explain PDFs
• Improve accessibility
• Simplify difficult text
• Translate content
• Generate accessibility reports
• Answer questions from uploaded files

Upload a document or ask me anything to get started.`;

export const AIChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: INITIAL_WELCOME_MSG,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeDocContext, setActiveDocContext] = useState(null);
  const [failedQuery, setFailedQuery] = useState(null);
  const { addToast } = useNotification();

  useEffect(() => {
    const savedDoc = localStorage.getItem('ascess_active_doc');
    if (savedDoc) {
      try {
        setActiveDocContext(JSON.parse(savedDoc));
      } catch (e) {}
    }
  }, []);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setFailedQuery(null);

    // Document Empty State Check
    const lowerQ = query.toLowerCase();
    const isDocQuery = lowerQ.includes('summarize my document') || lowerQ.includes('explain this paragraph') || lowerQ.includes('answer questions from uploaded');

    if (isDocQuery && !activeDocContext) {
      const userMsg = {
        id: Date.now().toString(),
        sender: 'user',
        text: query,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const emptyStateResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ **No document uploaded yet.**\n\nPlease upload a PDF, image, or website URL from the **Upload & OCR** section to begin automated document analysis.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg, emptyStateResponse]);
      if (!textToSend) setInput('');
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    try {
      let reply = '';
      const historyPayload = messages.map((m) => ({ sender: m.sender, text: m.text }));

      if (activeDocContext) {
        const res = await aiService.chat(query, historyPayload, activeDocContext);
        reply = res.data?.response || res.response || res.data;
      } else {
        const res = await aiService.chat(query, historyPayload);
        reply = res.data?.response || res.response || res.data;
      }

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: typeof reply === 'string' ? reply : JSON.stringify(reply),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setFailedQuery(query);
      addToast({ message: err.message || 'Failed to connect to Gemini AI Engine.', type: 'error' });
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        isError: true,
        text: `❌ **Connection Error**: Unable to reach Gemini AI Engine. Please check your network or retry.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: INITIAL_WELCOME_MSG,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setFailedQuery(null);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-140px)] gap-4 overflow-hidden max-w-6xl mx-auto">
        {/* History Drawer Sidebar */}
        <div className="hidden lg:flex flex-col w-64 glass-card rounded-2xl p-3 border border-slate-800 gap-2 shrink-0">
          <Button onClick={handleClear} variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
            <FiPlus /> New Chat Session
          </Button>

          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mt-2">
            Active Chat Thread
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto flex-1 text-xs">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20 flex items-center justify-between">
              <span className="flex items-center gap-2 truncate"><FiMessageSquare /> Accessibility Assistant Thread</span>
              <button onClick={handleClear} className="text-slate-500 hover:text-red-400"><FiTrash2 /></button>
            </div>
          </div>
        </div>

        {/* Main Conversation Canvas */}
        <Card className="flex-1 flex flex-col p-4 justify-between border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold text-xs flex items-center gap-1.5"><FiCpu /> ascess-1-ai Accessibility Assistant</span>
              {activeDocContext ? (
                <Badge variant="info" className="flex items-center gap-1 text-[10px]">
                  <FiFileText /> Document: {activeDocContext.title}
                </Badge>
              ) : (
                <Badge variant="warning" className="text-[10px]">No Active Document</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeDocContext && (
                <button
                  onClick={() => {
                    localStorage.removeItem('ascess_active_doc');
                    setActiveDocContext(null);
                    addToast({ message: 'Active document detached from AI context.', type: 'info' });
                  }}
                  className="text-xs text-red-400 hover:underline"
                >
                  Detach Document
                </button>
              )}
              <button onClick={handleClear} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                <FiRotateCcw /> Clear
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white'
                      : msg.isError
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  }`}
                >
                  {msg.sender === 'user' ? <FiUser /> : msg.isError ? <FiAlertCircle /> : <FiCpu />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-none'
                      : 'glass-card border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap font-sans'
                  }`}
                >
                  {msg.text}
                  <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-700/30 text-[10px] opacity-60">
                    <span>{msg.time}</span>
                    {msg.sender === 'ai' && !msg.isError && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          addToast({ message: 'Response copied!', type: 'info' });
                        }}
                        className="hover:text-cyan-300 flex items-center gap-1"
                      >
                        <FiCopy /> Copy
                      </button>
                    )}
                    {msg.isError && failedQuery && (
                      <button
                        onClick={() => handleSend(failedQuery)}
                        className="text-red-300 hover:text-white flex items-center gap-1 font-bold"
                      >
                        <FiRefreshCw /> Retry Query
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-3 text-xs text-cyan-400 font-medium p-2 animate-pulse">
                <FiCpu className="animate-spin text-base" /> ascess-1-ai Accessibility Assistant is analyzing...
              </div>
            )}
          </div>

          {/* Clickable Suggested Questions */}
          <div className="flex flex-wrap gap-1.5 py-2 border-t border-slate-800/60">
            {SUGGESTIONS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all text-left font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeDocContext
                    ? `Ask questions about attached "${activeDocContext.title}"...`
                    : 'Ask ascess-1-ai Accessibility Assistant anything...'
                }
                className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60 pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                <button type="button" className="hover:text-cyan-400 text-sm"><FiPaperclip /></button>
                <button type="button" className="hover:text-cyan-400 text-sm"><FiMic /></button>
              </div>
            </div>
            <Button type="submit" disabled={isThinking} className="px-5 py-3 flex items-center gap-2">
              <FiSend /> Send
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIChatPage;
