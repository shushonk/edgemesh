import React, { useState } from 'react';
import { Settings, Shield, Globe, Bell, CheckCircle2 } from 'lucide-react';

interface SettingsTabProps {
  currentWorkspace: any;
  cpuThreshold: number;
  setCpuThreshold: (v: number) => void;
  memThreshold: number;
  setMemThreshold: (v: number) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ currentWorkspace, cpuThreshold, setCpuThreshold, memThreshold, setMemThreshold, addToast }) => {
  const [providerMode, setProviderMode] = useState('demo');
  const [wsName, setWsName] = useState(currentWorkspace?.name || 'Global Production');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Workspace settings saved successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-white tracking-tight">Workspace & Infrastructure Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure adapter mode, telemetry retention, workspace parameters, and security policies.
        </p>
      </div>

      {/* Settings Form */}
      <div className="p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Workspace Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Workspace Name</label>
                <input
                  type="text"
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Plan Tier</label>
                <input
                  type="text"
                  disabled
                  value={currentWorkspace?.plan || 'Enterprise'}
                  className="w-full bg-[#080B12]/50 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">Monitoring Thresholds</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CPU Usage Alert (%)</label>
                <input
                  type="number"
                  value={cpuThreshold}
                  onChange={(e) => setCpuThreshold(Number(e.target.value))}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Memory Usage Alert (%)</label>
                <input
                  type="number"
                  value={memThreshold}
                  onChange={(e) => setMemThreshold(Number(e.target.value))}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2">Infrastructure Provider Architecture</h3>
            <p className="text-xs text-slate-400 mb-4">
              Switch between simulated demo mode and connected provider adapters (Cloudflare, Google Cloud CDN, Cloud Run).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProviderMode('demo')}
                className={`p-4 rounded-xl text-left border transition-all ${
                  providerMode === 'demo'
                    ? 'bg-[#3985FF]/15 border-[#3985FF] text-white shadow-lg'
                    : 'bg-[#080B12] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white mb-1">Demo & Simulation Mode</div>
                <div className="text-[11px] text-slate-400">Uses simulated metrics and mock edge node telemetry. Recommended for evaluation.</div>
              </button>

              <button
                type="button"
                onClick={() => { setProviderMode('connected'); addToast('Cloudflare & GCP adapter connector initialized.', 'info'); }}
                className={`p-4 rounded-xl text-left border transition-all ${
                  providerMode === 'connected'
                    ? 'bg-[#3985FF]/15 border-[#3985FF] text-white shadow-lg'
                    : 'bg-[#080B12] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white mb-1">Connected Provider Mode</div>
                <div className="text-[11px] text-slate-400">Connects live API credentials for Cloudflare Workers & Google Cloud CDN.</div>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#3985FF] hover:bg-[#3985FF]/90 text-white font-medium text-xs rounded-xl shadow-lg shadow-[#3985FF]/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
