import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Shield, Check, Globe2, Sparkles } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  plan: string;
}

interface HeaderProps {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  activeTabTitle
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'DDoS Mitigation Triggered', desc: 'Layer 7 attack mitigated on api.edgemesh.io', time: '2m ago', unread: true },
    { id: 2, title: 'Node Mumbai Degraded', desc: 'CPU usage exceeded 80% threshold', time: '14m ago', unread: true },
    { id: 3, title: 'Edge Function Deployed', desc: 'Geo-based redirect updated across 10 PoPs', time: '1h ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 px-8 bg-[#101522]/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-20 shrink-0">
      {/* Zone 1: Current section / Workspace info */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-bold text-white tracking-tight">{activeTabTitle}</h1>
        <div className="h-4 w-[1px] bg-slate-800"></div>
        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowWorkspaceMenu(!showWorkspaceMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-[#3985FF]" />
            <span>{currentWorkspace.name}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#3985FF]/20 text-[#16D9E8] rounded">
              {currentWorkspace.plan}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-[#101522] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-slide-up">
              <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Switch Workspace
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => { onSelectWorkspace(ws); setShowWorkspaceMenu(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-800/80 transition-colors"
                >
                  <div>
                    <div className="font-medium text-white">{ws.name}</div>
                    <div className="text-[10px] text-slate-400">Plan: {ws.plan}</div>
                  </div>
                  {ws.id === currentWorkspace.id && <Check className="w-4 h-4 text-[#3985FF]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div className="hidden md:flex items-center max-w-md w-full mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search edge nodes, CDN domains, rules, or functions... (Ctrl+K)"
            className="w-full bg-[#080B12] border border-slate-800 focus:border-[#3985FF] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Zone 3: Actions & Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* AI Assistant Quick Trigger */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#3985FF]/15 to-[#16D9E8]/15 border border-[#3985FF]/30 text-xs text-sky-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#16D9E8]" />
          <span>EdgeMesh AI Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowWorkspaceMenu(false); }}
            className="relative p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/40"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#101522] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Notifications</span>
                <button
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                  className="text-[10px] text-[#3985FF] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 hover:bg-slate-800/50 transition-colors ${n.unread ? 'bg-[#3985FF]/5' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3985FF] to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            EM
          </div>
          <div className="hidden xl:block">
            <span className="text-xs font-medium text-white block">Alex Mercer</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Shield className="w-3 h-3 text-emerald-400" /> Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
