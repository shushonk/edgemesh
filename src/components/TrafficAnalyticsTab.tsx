import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Globe,
  Server,
  Filter,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileCode,
  Check,
  X,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface TrafficAnalyticsTabProps {
  analyticsData: any;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TrafficAnalyticsTab: React.FC<TrafficAnalyticsTabProps> = ({ analyticsData, addToast }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exportScope, setExportScope] = useState<'all' | 'summary' | 'countries' | 'timeseries'>('all');

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

  const topCountries = analyticsData?.topCountries || [
    { country: "United States", code: "US", requests: "128.4B", percentage: 36.8 },
    { country: "Germany", code: "DE", requests: "54.1B", percentage: 15.5 },
    { country: "Japan", code: "JP", requests: "48.2B", percentage: 13.8 },
    { country: "United Kingdom", code: "GB", requests: "32.6B", percentage: 9.3 },
    { country: "India", code: "IN", requests: "28.9B", percentage: 8.3 },
    { country: "Others", code: "WW", requests: "56.7B", percentage: 16.3 }
  ];

  const timeSeries = analyticsData?.timeSeries || [
    { time: "00:00", requests: 98000, bandwidth: 420 },
    { time: "04:00", requests: 74000, bandwidth: 310 },
    { time: "08:00", requests: 142000, bandwidth: 680 },
    { time: "12:00", requests: 198000, bandwidth: 940 },
    { time: "16:00", requests: 215000, bandwidth: 1020 },
    { time: "20:00", requests: 164000, bandwidth: 780 }
  ];

  // CSV Generator
  const generateCsv = () => {
    const timestamp = new Date().toISOString();
    let csv = `EdgeMesh Global CDN & Edge Computing Telemetry Report\n`;
    csv += `Export Timestamp,${timestamp}\n`;
    csv += `Selected Timeframe,Last ${timeRange}\n`;
    csv += `Report Scope,${exportScope.toUpperCase()}\n\n`;

    if (exportScope === 'all' || exportScope === 'summary') {
      csv += `--- GLOBAL TELEMETRY SUMMARY ---\n`;
      csv += `Metric,Value\n`;
      csv += `Total Requests,${summary.totalRequests}\n`;
      csv += `Unique Visitors,${summary.uniqueVisitors}\n`;
      csv += `Total Bandwidth,${summary.totalBandwidth}\n`;
      csv += `Requests Per Second,${summary.requestsPerSec}\n`;
      csv += `Average Latency,${summary.avgLatency}\n`;
      csv += `P50 Latency,${summary.p50Latency}\n`;
      csv += `P95 Latency,${summary.p95Latency}\n`;
      csv += `P99 Latency,${summary.p99Latency}\n`;
      csv += `HTTP 2xx Success Rate,${summary.statusDistribution?.['2xx'] || 91.4}%\n`;
      csv += `HTTP 3xx Redirection Rate,${summary.statusDistribution?.['3xx'] || 5.2}%\n`;
      csv += `HTTP 4xx Client Error Rate,${summary.statusDistribution?.['4xx'] || 2.8}%\n`;
      csv += `HTTP 5xx Server Error Rate,${summary.statusDistribution?.['5xx'] || 0.6}%\n\n`;
    }

    if (exportScope === 'all' || exportScope === 'countries') {
      csv += `--- GEOGRAPHIC TRAFFIC BREAKDOWN ---\n`;
      csv += `Country,Country Code,Requests,Traffic Share Percentage\n`;
      topCountries.forEach((c: any) => {
        csv += `"${c.country}",${c.code},${c.requests},${c.percentage}%\n`;
      });
      csv += `\n`;
    }

    if (exportScope === 'all' || exportScope === 'timeseries') {
      csv += `--- TIME-SERIES TRAFFIC METRICS (UTC) ---\n`;
      csv += `Time (UTC),Requests Per Second,Bandwidth (Gbps)\n`;
      timeSeries.forEach((t: any) => {
        csv += `${t.time},${t.requests},${t.bandwidth}\n`;
      });
      csv += `\n`;
    }

    return csv;
  };

  // JSON Generator
  const generateJson = () => {
    const timestamp = new Date().toISOString();
    const exportPayload: any = {
      meta: {
        platform: "EdgeMesh Global CDN & Edge Computing",
        exportTimestamp: timestamp,
        timeframe: `Last ${timeRange}`,
        scope: exportScope,
        version: "2.4.0"
      }
    };

    if (exportScope === 'all' || exportScope === 'summary') {
      exportPayload.summary = summary;
    }
    if (exportScope === 'all' || exportScope === 'countries') {
      exportPayload.topCountries = topCountries;
    }
    if (exportScope === 'all' || exportScope === 'timeseries') {
      exportPayload.timeSeries = timeSeries;
    }

    return JSON.stringify(exportPayload, null, 2);
  };

  // Trigger browser download
  const handleDownload = () => {
    try {
      const content = exportFormat === 'csv' ? generateCsv() : generateJson();
      const mimeType = exportFormat === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `edgemesh-analytics-${timeRange}-${exportScope}-${dateStr}.${exportFormat}`;

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setShowExportModal(false);
      addToast(`Downloaded ${filename} successfully.`, 'success');
    } catch (err: any) {
      console.error("Export error:", err);
      addToast('Failed to export analytics data.', 'error');
    }
  };

  const previewSnippet = exportFormat === 'csv'
    ? generateCsv().split('\n').slice(0, 10).join('\n') + '\n...'
    : generateJson().split('\n').slice(0, 14).join('\n') + '\n  ...';

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

          {/* Export Data Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#3985FF] to-blue-600 hover:from-[#3985FF]/90 hover:to-blue-600/90 text-white text-xs font-medium rounded-xl transition-all shadow-lg shadow-[#3985FF]/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Data
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

      {/* Export Data Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3985FF]/20 text-[#3985FF] flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Export Traffic Analytics</h3>
                  <p className="text-[11px] text-slate-400">Download telemetry metrics for external BI and reporting</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Select Export Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      exportFormat === 'csv'
                        ? 'bg-[#3985FF]/15 border-[#3985FF] text-white shadow-sm'
                        : 'bg-[#080B12] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className={`w-5 h-5 ${exportFormat === 'csv' ? 'text-[#3985FF]' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">CSV Format</div>
                      <div className="text-[10px] text-slate-400">Spreadsheet & Excel compatible</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('json')}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      exportFormat === 'json'
                        ? 'bg-[#3985FF]/15 border-[#3985FF] text-white shadow-sm'
                        : 'bg-[#080B12] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <FileCode className={`w-5 h-5 ${exportFormat === 'json' ? 'text-[#16D9E8]' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">JSON Format</div>
                      <div className="text-[10px] text-slate-400">Raw programmatic payload</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Scope Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Data Scope</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'all', label: 'Complete Report (All Data)' },
                    { id: 'summary', label: 'Summary KPIs & Latency' },
                    { id: 'countries', label: 'Country Geographic Traffic' },
                    { id: 'timeseries', label: 'Time-Series Volume' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setExportScope(s.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        exportScope === s.id
                          ? 'bg-slate-800 border-[#3985FF] text-white font-medium'
                          : 'bg-[#080B12] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Preview */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-mono text-[10px] uppercase">Data Preview ({exportFormat.toUpperCase()})</span>
                  <span className="text-[10px] text-sky-400 font-mono">Timeframe: Last {timeRange}</span>
                </div>
                <div className="bg-[#080B12] border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-36 whitespace-pre">
                  {previewSnippet}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2 rounded-xl bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium shadow-lg shadow-[#3985FF]/20 flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download {exportFormat.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
