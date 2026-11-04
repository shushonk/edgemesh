import React from 'react';
import { Server, Zap, Activity, HardDrive, Globe, AlertTriangle, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';

interface OverviewTabProps {
  onNavigate: (tab: string) => void;
  nodes: any[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigate, nodes }) => {
  const activeCount = nodes.filter(n => n.status === 'healthy').length;
  const degradedCount = nodes.filter(n => n.status === 'degraded' || n.status === 'offline').length;

  const kpiCards = [
    { title: 'Global Edge Nodes', value: `${nodes.length} Active`, change: '+2 this month', icon: Server, color: 'text-[#3985FF]', bg: 'bg-[#3985FF]/10' },
    { title: 'Total Requests (24h)', value: '348.9B', change: '+14.2% vs yesterday', icon: Zap, color: 'text-[#16D9E8]', bg: 'bg-[#16D9E8]/10' },
    { title: 'Bandwidth Consumed', value: '1.84 PB', change: '94.8 Gbps peak', icon: HardDrive, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Avg Global Latency', value: '19.4ms', change: '-2.1ms optimization', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'CDN Cache Hit Ratio', value: '95.8%', change: '+0.4% efficiency', icon: ShieldCheck, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { title: 'Network Availability', value: '99.98%', change: 'All PoPs optimal', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner / Welcome */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#101522] via-[#0e1628] to-[#101522] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
              ● DEMO & ADAPTER MODE
            </span>
            <span className="text-xs text-slate-400 font-mono">Region: Global Anycast Mesh</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Global Edge Control Plane</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Managing distributed Points of Presence (PoPs) across 8 global regions. Real-time telemetry, zero-latency caching, and V8 edge worker runtimes operational.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('nodes')}
            className="px-4 py-2 bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium rounded-xl transition-all shadow-lg shadow-[#3985FF]/20 flex items-center gap-2"
          >
            <Server className="w-4 h-4" /> Manage Nodes ({nodes.length})
          </button>
          <button
            onClick={() => onNavigate('assistant')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-700 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-[#16D9E8]" /> Ask EdgeMesh AI
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#101522]/90 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 shadow-lg group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight mb-1">
                {card.value}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & World Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests & Bandwidth Chart Simulation */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Global Traffic Volume (24h)</h3>
              <p className="text-xs text-slate-400">Requests per second and bandwidth throughput across all edge nodes</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>138,400 req/s</span>
            </div>
          </div>

          {/* Visual SVG Chart simulation */}
          <div className="h-64 w-full flex items-end gap-2 pt-8 pb-2 px-2 relative border-b border-slate-800">
            {[45, 62, 58, 74, 88, 95, 82, 70, 85, 99, 110, 125, 140, 132, 118, 125, 142, 155, 138, 120, 98, 85, 75, 90].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div
                  className="w-full bg-gradient-to-t from-[#3985FF]/30 via-[#3985FF] to-[#16D9E8] rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                  style={{ height: `${(val / 160) * 100}%` }}
                ></div>
                {idx % 4 === 0 && (
                  <span className="absolute -bottom-6 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                    {idx.toString().padStart(2, '0')}:00
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 text-xs text-slate-400">
            <span>Peak: 155k req/s at 17:00 UTC</span>
            <button onClick={() => onNavigate('analytics')} className="text-[#3985FF] hover:underline flex items-center gap-1 font-medium">
              View Advanced Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PoP Health & Status Card */}
        <div className="p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Edge PoP Health</h3>
              <span className="text-xs text-emerald-400 font-mono">10 Operational</span>
            </div>
            <div className="space-y-3">
              {nodes.slice(0, 5).map((node) => (
                <div key={node.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${node.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                    <div>
                      <div className="text-xs font-medium text-white">{node.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{node.region} · {node.latency}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-300">
                    {node.cpu}% CPU
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('nodes')}
            className="w-full mt-4 py-2 text-xs font-medium text-center bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700"
          >
            View All Edge Nodes
          </button>
        </div>
      </div>
    </div>
  );
};
