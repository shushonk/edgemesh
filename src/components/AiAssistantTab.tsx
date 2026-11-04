import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Zap, ArrowRight } from 'lucide-react';

interface AiAssistantTabProps {
  nodes: any[];
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({ nodes, addToast }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am EdgeMesh AI, your global edge infrastructure co-pilot. I have analyzed your 10 edge PoPs and telemetry metrics. Note: I operate on demo simulation data connected to your dashboard state. How can I help you optimize cache rules, analyze traffic spikes, or troubleshoot latency today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const promptSuggestions = [
    "Why is the Mumbai edge node showing high CPU usage?",
    "Recommend cache TTL optimizations for static assets",
    "Explain our P99 latency spikes during peak hours",
    "How can I set up geo-routing for European users?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, context: { nodes } })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `[AI Error]: ${err.message || 'Failed to connect to Gemini API. Please check your API key in Settings > Secrets.'}`
        }
      ]);
      addToast('AI Assistant query failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#16D9E8]" /> EdgeMesh AI Network Assistant
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Powered by Gemini 3.8 Flash via secure server-side calls. Expert infrastructure reasoning & telemetry diagnosis.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#3985FF]/15 border border-[#3985FF]/30 text-sky-300 text-xs font-mono">
          <Zap className="w-4 h-4 text-[#3985FF]" /> Gemini 3.8 Flash Active
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-[#101522] border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div key={idx} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isUser ? 'bg-[#3985FF] text-white' : 'bg-[#16D9E8]/20 text-[#16D9E8] border border-[#16D9E8]/30'}`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#3985FF] text-white rounded-tr-none'
                    : 'bg-[#080B12] text-slate-200 border border-slate-800 rounded-tl-none font-mono whitespace-pre-wrap'
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#16D9E8]/20 text-[#16D9E8] border border-[#16D9E8]/30 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#080B12] border border-slate-800 text-xs text-slate-400 font-mono">
                EdgeMesh AI is analyzing network telemetry...
              </div>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-6 py-2 bg-[#0c101a] border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">Quick Prompts:</span>
          {promptSuggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition-colors border border-slate-700/60"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#101522] border-t border-slate-800">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask EdgeMesh AI about edge nodes, cache hit ratios, or routing optimizations..."
              className="flex-1 bg-[#080B12] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#3985FF]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-[#3985FF] hover:bg-[#3985FF]/90 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-all shadow-lg shadow-[#3985FF]/20 flex items-center gap-2 shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
