import React, { useState } from 'react';
import { Database, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CacheManagementTabProps {
  cacheData: any;
  onPurgeCache: (scope: string, target: string) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CacheManagementTab: React.FC<CacheManagementTabProps> = ({ cacheData, onPurgeCache, addToast }) => {
  const [purgeUrl, setPurgeUrl] = useState('');

  const hitRatio = cacheData?.hitRatio || 95.8;
  const missRatio = cacheData?.missRatio || 4.2;
  const totalSize = cacheData?.totalCacheSize || "420 TB";
  const objects = cacheData?.cachedObjects || "1.4 Billion";

  const handlePurge = (e: React.FormEvent) => {
    e.preventDefault();
    onPurgeCache('Cache Management Portal', purgeUrl || 'All cache objects');
    setPurgeUrl('');
    addToast('Cache purge executed successfully across global PoPs.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Global Cache Control & Invalidation</h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor cache hit/miss ratio, storage pools, TTL policies, and execute instant cache purges.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 mb-1">Cache Hit Ratio</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{hitRatio}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Miss Ratio: {missRatio}%</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 mb-1">Total Cache Size</div>
          <div className="text-2xl font-bold font-mono text-white">{totalSize}</div>
          <div className="text-[11px] text-slate-400 mt-1">Distributed SSD Tier</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 mb-1">Cached Objects</div>
          <div className="text-2xl font-bold font-mono text-sky-400">{objects}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active items in memory</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 mb-1">Invalidation Speed</div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 120ms</div>
          <div className="text-[11px] text-emerald-400 mt-1">Global propagation</div>
        </div>
      </div>

      {/* Purge Console */}
      <div className="p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Instant Purge Invalidation Console</h3>
        <p className="text-xs text-slate-400">
          Enter a specific asset URL to purge or click purge all cache objects across all 10 edge nodes.
        </p>

        <form onSubmit={handlePurge} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={purgeUrl}
            onChange={(e) => setPurgeUrl(e.target.value)}
            placeholder="https://cdn.enterprise-app.com/assets/* (leave blank for all)"
            className="flex-1 bg-[#080B12] border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#3985FF]"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Purge Cache Now
          </button>
        </form>
      </div>
    </div>
  );
};
