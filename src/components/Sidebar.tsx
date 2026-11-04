import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Server,
  Layers,
  Code2,
  BarChart3,
  Database,
  ShieldCheck,
  Sparkles,
  Key,
  Settings,
  Cpu,
  Radio
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'network', label: 'Global Network', icon: Globe },
    { id: 'nodes', label: 'Edge Nodes', icon: Server },
    { id: 'cdn', label: 'CDN Management', icon: Layers },
    { id: 'functions', label: 'Edge Functions', icon: Code2 },
    { id: 'analytics', label: 'Traffic Analytics', icon: BarChart3 },
    { id: 'cache', label: 'Cache Management', icon: Database },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'assistant', label: 'AI Network Assistant', icon: Sparkles, badge: 'AI' },
    { id: 'apikeys', label: 'API Keys', icon: Key },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#101522] border-r border-slate-800/80 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3985FF] to-[#16D9E8] flex items-center justify-center shadow-lg shadow-[#3985FF]/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block">EdgeMesh</span>
            <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Global Edge Control
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase">
          Infrastructure
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#3985FF]/15 text-[#3985FF] shadow-sm border border-[#3985FF]/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#3985FF]' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#3985FF]/20 text-sky-300 rounded border border-[#3985FF]/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Telemetry Status */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0c101a]">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Active PoPs
          </span>
          <span className="font-mono text-slate-200">10 / 10 Online</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-[#16D9E8] h-full w-full rounded-full"></div>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
          <span>Global Latency: 19.4ms</span>
          <span className="text-emerald-400 font-mono">99.98% SLA</span>
        </div>
      </div>
    </aside>
  );
};
