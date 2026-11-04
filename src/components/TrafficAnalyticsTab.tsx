import React, { useState } from 'react';
import { BarChart3, Calendar, Globe, Server, Filter, TrendingUp, Download } from 'lucide-react';

interface TrafficAnalyticsTabProps {
  analyticsData: any;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TrafficAnalyticsTab: React.FC<TrafficAnalyticsTabProps> = ({ analyticsData, addToast }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [regionFilter, setRegionFilter] = useState('all');

  const summary = analyticsData?.summary || {
    totalRequests: "348.9 Billion",
    uniqueVisitors: "42.1 Billion",
    totalBandwidth: "1.84 PB",
    requestsPerSec: "138,400 req/s",
    avgLatency: "19.4ms",
    p50Latency: "14ms",
    p95Latency: "48ms",
    p99Latency: "112ms",
    statusDistribution: { "2xx": 91.4, "3xx": 5.2, "4xx": 2.8, "5xx": 0.6 }
  };

  const topCountries = analyticsData?.topCountries || [];

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Traffic Analytics & Observability</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, latency percentiles, status distribution, and geo-traffic breakdown.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center bg-[#080B12] rounded-xl border border-slate-800 p-1">
            {['24h', '7d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => { setTimeRange(r); addToast(`Analytics filtered to Last ${r}`, 'info'); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${timeRange === r ? 'bg-[#3985FF] text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => addToast('Analytics CSV report exported successfully.', 'success')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#16D9E8]" /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 mb-1">Total Requests</div>
          <div className="text-2xl font-bold font-mono text-white">{summary.totalRequests}</div>
          <div className="text-[11px] text-emerald-400 mt-1">+12.4% vs prev period</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 mb-1">Unique Visitors</div>
          <div className="text-2xl font-bold font-mono text-white">{summary.uniqueVisitors}</div>
          <div className="text-[11px] text-emerald-400 mt-1">+8.1% vs prev period</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 mb-1">Bandwidth</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{summary.totalBandwidth}</div>
          <div className="text-[11px] text-slate-400 mt-1">Peak 94.8 Gbps</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 mb-1">Latency P99</div>
          <div className="text-2xl font-bold font-mono text-sky-400">{summary.p99Latency}</div>
          <div className="text-[11px] text-slate-400 mt-1">P50: {summary.p50Latency} · P95: {summary.p95Latency}</div>
        </div>
      </div>

      {/* Charts & Top Countries Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Code Distribution & Latency */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">HTTP Response Status Distribution</h3>
            <p className="text-xs text-slate-400">Proportion of 2xx, 3xx, 4xx, and 5xx responses served by edge nodes</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400">2xx Success ({summary.statusDistribution["2xx"]}%)</span>
                <span className="text-slate-400">318.4 Billion</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${summary.statusDistribution["2xx"]}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-sky-400">3xx Redirection ({summary.statusDistribution["3xx"]}%)</span>
                <span className="text-slate-400">18.1 Billion</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: `${summary.statusDistribution["3xx"]}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-400">4xx Client Error ({summary.statusDistribution["4xx"]}%)</span>
                <span className="text-slate-400">9.7 Billion</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${summary.statusDistribution["4xx"]}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-rose-400">5xx Server Error ({summary.statusDistribution["5xx"]}%)</span>
                <span className="text-slate-400">2.1 Billion</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-400 h-full rounded-full" style={{ width: `${summary.statusDistribution["5xx"]}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Countries */}
        <div className="p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Top Countries by Traffic</h3>
            <div className="space-y-3">
              {topCountries.map((c: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#3985FF]/20 text-[#3985FF] font-mono text-[10px] flex items-center justify-center font-bold">
                      {c.code}
                    </span>
                    <span className="text-xs font-medium text-white">{c.country}</span>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-white">{c.requests}</div>
                    <div className="text-[10px] text-slate-400">{c.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
