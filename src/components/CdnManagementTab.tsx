import React, { useState } from 'react';
import { Layers, Plus, Trash2, RefreshCw, Shield, Globe, CheckCircle2, X } from 'lucide-react';

interface CdnManagementTabProps {
  cdnData: any;
  onAddDomain: (domain: { domain: string; origin: string }) => void;
  onPurgeCache: (scope: string, target: string) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CdnManagementTab: React.FC<CdnManagementTabProps> = ({
  cdnData,
  onAddDomain,
  onPurgeCache,
  addToast
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [originInput, setOriginInput] = useState('');
  const [purgeUrl, setPurgeUrl] = useState('');

  const domains = cdnData?.domains || [];
  const rules = cdnData?.cacheRules || [];

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput || !originInput) {
      addToast('Domain and origin server are required.', 'error');
      return;
    }
    onAddDomain({ domain: domainInput, origin: originInput });
    setDomainInput('');
    setOriginInput('');
    setShowAddModal(false);
    addToast('CDN domain zone created successfully.', 'success');
  };

  const handlePurgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPurgeCache('URL / Custom', purgeUrl || 'All zones');
    setShowPurgeModal(false);
    setPurgeUrl('');
    addToast('Cache purge initiated across all 10 edge PoPs.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">CDN Zones & Caching Rules</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure origin servers, TLS termination, cache TTLs, and instant purge across distributed edge nodes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPurgeModal(true)}
            className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Purge Cache
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium rounded-xl transition-all shadow-lg shadow-[#3985FF]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add CDN Domain
          </button>
        </div>
      </div>

      {/* Domains Table */}
      <div className="rounded-2xl bg-[#101522] border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-[#0c101a] flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">Active CDN Zones</h3>
          <span className="text-xs font-mono text-slate-400">{domains.length} Domain(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0c101a]/50 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Domain / Hostname</th>
                <th className="py-3.5 px-4">Origin Server</th>
                <th className="py-3.5 px-4">SSL / TLS Status</th>
                <th className="py-3.5 px-4">Requests (24h)</th>
                <th className="py-3.5 px-4">Bandwidth</th>
                <th className="py-3.5 px-6 text-right">Cache Hit Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {domains.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#3985FF]" />
                    {d.domain}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    {d.origin}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Shield className="w-3 h-3" /> {d.ssl}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-200">
                    {d.requests}
                  </td>
                  <td className="py-4 px-4 font-mono text-emerald-400">
                    {d.bandwidth}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-sky-400">
                    {d.cacheHitRatio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cache Rules Section */}
      <div className="rounded-2xl bg-[#101522] border border-slate-800 shadow-xl overflow-hidden p-6">
        <h3 className="text-sm font-bold text-white mb-4">Edge Cache Rules & TTL Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule: any) => (
            <div key={rule.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-white mb-1">{rule.pattern}</div>
                <div className="text-[11px] text-slate-400">TTL: <span className="text-sky-300 font-mono">{rule.ttl}</span> · Browser: {rule.browserCache}</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {rule.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#3985FF]" /> Add CDN Domain Zone
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDomainSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Domain Name</label>
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="e.g. assets.mycompany.com"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Origin Server URL / IP</label>
                <input
                  type="text"
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value)}
                  placeholder="e.g. origin.internal.net or AWS S3 bucket"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#3985FF]"
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
                  Create Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purge Cache Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" /> Purge CDN Cache
              </h3>
              <button onClick={() => setShowPurgeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePurgeSubmit} className="space-y-4">
              <p className="text-xs text-slate-300">
                Purging cache invalidates cached assets across all 10 global edge nodes instantly. Enter a specific URL path or leave blank to purge all zones.
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">URL Path (Optional)</label>
                <input
                  type="text"
                  value={purgeUrl}
                  onChange={(e) => setPurgeUrl(e.target.value)}
                  placeholder="e.g. https://api.edgemesh.io/static/main.js"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPurgeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Confirm Instant Purge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
