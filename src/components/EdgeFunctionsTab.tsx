import React, { useState } from 'react';
import { Code2, Play, Rocket, Plus, Trash2, CheckCircle2, Clock, Terminal, X } from 'lucide-react';

interface EdgeFunctionsTabProps {
  functionsList: any[];
  onAddFunction: (fn: { name: string; runtime: string; triggers: string; code: string }) => void;
  onDeployFunction: (id: string) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const EdgeFunctionsTab: React.FC<EdgeFunctionsTabProps> = ({
  functionsList,
  onAddFunction,
  onDeployFunction,
  addToast
}) => {
  const [selectedFunc, setSelectedFunc] = useState(functionsList[0] || null);
  const [activeCode, setActiveCode] = useState(selectedFunc?.code || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [triggers, setTriggers] = useState('/api/v1/*');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSelectFunc = (fn: any) => {
    setSelectedFunc(fn);
    setActiveCode(fn.code);
    setTestResult(null);
  };

  const handleRunSandbox = () => {
    setTestResult(`[Sandbox Execution Success] Request processed at edge PoP (Frankfurt). Status: 200 OK. Execution time: 0.8ms. Response headers modified successfully.`);
    addToast('Edge function executed successfully in V8 sandbox.', 'success');
  };

  const handleDeploy = (id: string) => {
    onDeployFunction(id);
    addToast('Edge function deployed globally across all 10 edge nodes.', 'success');
  };

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      addToast('Function name is required.', 'error');
      return;
    }
    onAddFunction({
      name,
      runtime: 'JavaScript (V8 Isolate)',
      triggers,
      code: `export default {\n  async fetch(request) {\n    return new Response("Hello from EdgeMesh Function: ${name}");\n  }\n};`
    });
    setName('');
    setShowAddModal(false);
    addToast('Edge function created successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Edge Functions (Serverless Workers)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Deploy JavaScript and TypeScript functions on V8 isolates running directly at edge nodes worldwide.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium rounded-xl transition-all shadow-lg shadow-[#3985FF]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Function
        </button>
      </div>

      {/* Main Split: Functions List & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">Deployed Functions</div>
          {functionsList.map((fn) => {
            const isSelected = selectedFunc?.id === fn.id;
            return (
              <button
                key={fn.id}
                onClick={() => handleSelectFunc(fn)}
                className={`w-full text-left p-4 rounded-2xl transition-all border flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#3985FF]/15 border-[#3985FF] shadow-lg shadow-[#3985FF]/10'
                    : 'bg-[#101522] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2 truncate">
                    <Code2 className="w-4 h-4 text-[#16D9E8]" />
                    {fn.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${fn.status === 'deployed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {fn.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Triggers: {fn.triggers}</span>
                  <span>{fn.invocations}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Code Editor & Sandbox */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            {selectedFunc ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedFunc.name}</h3>
                    <span className="text-xs font-mono text-slate-400">Runtime: {selectedFunc.runtime} · Triggers: {selectedFunc.triggers}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunSandbox}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-400" /> Test Sandbox
                    </button>
                    <button
                      onClick={() => handleDeploy(selectedFunc.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium shadow-lg shadow-[#3985FF]/20 flex items-center gap-1.5 transition-colors"
                    >
                      <Rocket className="w-3.5 h-3.5" /> Deploy Global
                    </button>
                  </div>
                </div>

                {/* Editor Textarea */}
                <div className="relative rounded-xl bg-[#080B12] border border-slate-800 overflow-hidden">
                  <div className="bg-[#0c101a] px-4 py-2 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>index.ts / worker.js</span>
                    <span className="text-emerald-400">V8 Isolate Sandbox</span>
                  </div>
                  <textarea
                    value={activeCode}
                    onChange={(e) => setActiveCode(e.target.value)}
                    rows={12}
                    className="w-full bg-[#080B12] p-4 font-mono text-xs text-sky-200 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Sandbox Output Console */}
                {testResult && (
                  <div className="mt-4 p-3 rounded-xl bg-[#080B12] border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-3 animate-slide-up">
                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{testResult}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 text-slate-500">Select an edge function to edit code and test.</div>
            )}
          </div>
        </div>
      </div>

      {/* Create Function Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#3985FF]" /> Create Edge Function
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitNew} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Function Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rate Limit Guard"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Route Trigger Pattern</label>
                <input
                  type="text"
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  placeholder="/api/v1/checkout/*"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium shadow-lg shadow-[#3985FF]/20"
                >
                  Create Function
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
