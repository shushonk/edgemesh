import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Shield,
  Check,
  Globe2,
  Sparkles,
  Server,
  Layers,
  Database,
  Code2,
  Sliders,
  Key,
  ShieldCheck,
  X,
  ArrowRight,
  CornerDownLeft,
  FileCode
} from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  plan: string;
}

interface SearchItem {
  id: string;
  title: string;
  category: 'node' | 'domain' | 'config' | 'function' | 'navigation';
  subtitle: string;
  tab: string;
  badge?: string;
}

interface HeaderProps {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
  activeTabTitle: string;
  nodes?: any[];
  domains?: any[];
  cacheRules?: any[];
  functionsList?: any[];
  onNavigate: (tab: string, itemTitle?: string) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const Header: React.FC<HeaderProps> = ({
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  activeTabTitle,
  nodes = [],
  domains = [],
  cacheRules = [],
  functionsList = [],
  onNavigate,
  addToast
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'DDoS Mitigation Triggered', desc: 'Layer 7 attack mitigated on api.edgemesh.io', time: '2m ago', unread: true },
    { id: 2, title: 'Node Mumbai Degraded', desc: 'CPU usage exceeded 80% threshold', time: '14m ago', unread: true },
    { id: 3, title: 'Edge Function Deployed', desc: 'Geo-based redirect updated across 10 PoPs', time: '1h ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Global hotkey Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside search container to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Static configuration & navigation targets searchable globally
  const staticConfigs: SearchItem[] = [
    { id: 'cfg-ttl', title: 'Cache TTL & Invalidation Rules', category: 'config', subtitle: 'Manage edge cache expiration policies and purges', tab: 'cache', badge: 'Rule' },
    { id: 'cfg-waf', title: 'WAF & DDoS Mitigation Shield', category: 'config', subtitle: 'Layer 7 adaptive ML firewall and IP denylists', tab: 'security', badge: 'Security' },
    { id: 'cfg-ssl', title: 'SSL/TLS 1.3 Termination Settings', category: 'config', subtitle: 'Automatic certificate management and strict HTTPS', tab: 'security', badge: 'TLS' },
    { id: 'cfg-provider', title: 'Cloudflare & GCP Adapter Configuration', category: 'config', subtitle: 'Switch between demo and connected edge providers', tab: 'settings', badge: 'Settings' },
    { id: 'cfg-apikeys', title: 'API Gateway Tokens & CI/CD Credentials', category: 'config', subtitle: 'Generate programmatic authentication tokens', tab: 'apikeys', badge: 'API' },
    { id: 'cfg-ai', title: 'EdgeMesh AI Assistant & Prompt Co-pilot', category: 'config', subtitle: 'Gemini-powered network latency and anomaly analysis', tab: 'assistant', badge: 'Gemini' },
    { id: 'nav-overview', title: 'Infrastructure Overview Dashboard', category: 'navigation', subtitle: 'Global KPI telemetry and traffic summaries', tab: 'overview' },
    { id: 'nav-network', title: 'Global Network & Anycast Matrix', category: 'navigation', subtitle: 'Regional Anycast PoP status and latency map', tab: 'network' },
    { id: 'nav-analytics', title: 'Traffic Analytics & Percentiles', category: 'navigation', subtitle: 'P50, P95, P99 latency and status distribution', tab: 'analytics' }
  ];

  // Dynamic search index
  const allSearchItems: SearchItem[] = [
    ...nodes.map((n: any) => ({
      id: `node-${n.id}`,
      title: n.name,
      category: 'node' as const,
      subtitle: `${n.region} · IP: ${n.ip} · Latency: ${n.latency}`,
      tab: 'nodes',
      badge: n.status
    })),
    ...domains.map((d: any) => ({
      id: `dom-${d.id}`,
      title: d.domain,
      category: 'domain' as const,
      subtitle: `Origin: ${d.origin} · Cache Hit: ${d.cacheHitRatio} · SSL: ${d.ssl}`,
      tab: 'cdn',
      badge: 'Zone'
    })),
    ...cacheRules.map((r: any) => ({
      id: `rule-${r.id}`,
      title: `Cache Pattern: ${r.pattern}`,
      category: 'config' as const,
      subtitle: `TTL: ${r.ttl} · Browser Cache: ${r.browserCache}`,
      tab: 'cdn',
      badge: 'Cache'
    })),
    ...functionsList.map((f: any) => ({
      id: `func-${f.id}`,
      title: f.name,
      category: 'function' as const,
      subtitle: `Runtime: ${f.runtime} · Triggers: ${f.triggers}`,
      tab: 'functions',
      badge: f.status
    })),
    ...staticConfigs
  ];

  // Filter items by query
  const filteredResults = searchQuery.trim() === ''
    ? allSearchItems.slice(0, 6)
    : allSearchItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelectItem = (item: SearchItem) => {
    onNavigate(item.tab, item.title);
    setIsSearchOpen(false);
    setSearchQuery('');
    addToast(`Navigated to ${item.title}`, 'info');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'node':
        return <Server className="w-4 h-4 text-[#3985FF]" />;
      case 'domain':
        return <Globe2 className="w-4 h-4 text-[#16D9E8]" />;
      case 'function':
        return <Code2 className="w-4 h-4 text-purple-400" />;
      case 'config':
        return <Sliders className="w-4 h-4 text-amber-400" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <header className="h-16 px-8 bg-[#101522]/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-20 shrink-0">
      {/* Zone 1: Current section / Workspace info */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-bold text-white tracking-tight">{activeTabTitle}</h1>
        <div className="h-4 w-[1px] bg-slate-800"></div>
        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowWorkspaceMenu(!showWorkspaceMenu); setShowNotifications(false); setIsSearchOpen(false); }}
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
      <div ref={searchContainerRef} className="relative max-w-md w-full mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search edge nodes, domains, rules, or settings... (Ctrl+K)"
            className="w-full bg-[#080B12] border border-slate-800 focus:border-[#3985FF] rounded-xl pl-10 pr-16 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/70 border border-slate-700/60 rounded">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Global Search Results Dropdown Palette */}
        {isSearchOpen && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-[#101522] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up max-h-96 flex flex-col">
            <div className="p-3 bg-[#0c101a] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{searchQuery ? `Results for "${searchQuery}"` : 'Quick Navigation & Suggestions'}</span>
              <span>{filteredResults.length} matches</span>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-800/60 p-1">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="w-full text-left p-3 hover:bg-slate-800/60 rounded-xl transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 group-hover:border-[#3985FF]/50 transition-colors">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-[#3985FF] transition-colors truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded border uppercase shrink-0 ${
                              item.badge === 'healthy'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : item.badge === 'degraded'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-slate-800 text-sky-300 border-slate-700'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 group-hover:text-white shrink-0 font-medium">
                      <span className="capitalize">{item.category}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-1">
                  <Search className="w-6 h-6 text-slate-400 mx-auto mb-2 opacity-50" />
                  <div className="text-xs font-medium text-slate-300">No matches found for "{searchQuery}"</div>
                  <div className="text-[11px]">Try searching by node name ("Frankfurt"), domain ("api.edgemesh.io"), or setting ("WAF", "Cache", "TTL").</div>
                </div>
              )}
            </div>

            <div className="p-2.5 bg-[#0c101a] border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" /> Select to navigate
              </span>
              <span>Press ESC to close</span>
            </div>
          </div>
        )}
      </div>

      {/* Zone 3: Actions & Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* AI Assistant Quick Trigger */}
        <button
          onClick={() => onNavigate('assistant', 'EdgeMesh AI Assistant')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#3985FF]/15 to-[#16D9E8]/15 hover:from-[#3985FF]/25 hover:to-[#16D9E8]/25 border border-[#3985FF]/30 text-xs text-sky-300 font-medium transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#16D9E8]" />
          <span>EdgeMesh AI Active</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowWorkspaceMenu(false); setIsSearchOpen(false); }}
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
