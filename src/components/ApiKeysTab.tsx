import React, { useState } from 'react';
import { Key, Plus, Trash2, Shield, Copy, Check } from 'lucide-react';

interface ApiKeysTabProps {
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ApiKeysTab: React.FC<ApiKeysTabProps> = ({ addToast }) => {
  const [keys, setKeys] = useState([
    { id: 'key-1', name: 'Production Gateway Token', prefix: 'em_live_9981...', created: 'Jan 12, 2026', scopes: ['Full CDN Control', 'Edge Functions Deploy'] },
    { id: 'key-2', name: 'CI/CD Pipeline Deployer', prefix: 'em_ci_4412...', created: 'Feb 04, 2026', scopes: ['Edge Functions Deploy', 'Read Analytics'] }
  ]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [keyName, setKeyName] = useState('');

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;
    const newK = {
      id: `key-${Date.now()}`,
      name: keyName,
      prefix: `em_live_${Math.random().toString(36).substring(2, 6)}...`,
      created: 'Just now',
      scopes: ['Full CDN Control', 'Read Analytics']
    };
    setKeys([...keys, newK]);
    setKeyName('');
    setShowNewModal(false);
    addToast('New API integration key generated successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">API Integration Keys & Adapters</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage programmatic access tokens for Cloudflare API, Google Cloud CDN, and EdgeMesh CI/CD adapters.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium rounded-xl transition-all shadow-lg shadow-[#3985FF]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Generate New API Key
        </button>
      </div>

      {/* Keys Table */}
      <div className="rounded-2xl bg-[#101522] border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-[#0c101a] flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">Active API Tokens</h3>
          <span className="text-xs font-mono text-slate-400">{keys.length} Token(s)</span>
        </div>
        <div className="divide-y divide-slate-800/60 text-xs">
          {keys.map((k) => (
            <div key={k.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#3985FF]/10 text-[#3985FF] flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">{k.name}</div>
                  <div className="font-mono text-[11px] text-slate-400 mt-0.5">{k.prefix} · Created {k.created}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1.5">
                  {k.scopes.map((scope, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {scope}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setKeys(keys.filter(item => item.id !== k.id));
                    addToast(`Revoked API token ${k.name}`, 'success');
                  }}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <h3 className="text-base font-bold text-white mb-4">Generate API Key</h3>
            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Key Name / Purpose</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Terraform Provider Key"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3985FF] text-white text-xs font-medium"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
