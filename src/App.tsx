import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { GlobalNetworkTab } from './components/GlobalNetworkTab';
import { EdgeNodesTab } from './components/EdgeNodesTab';
import { CdnManagementTab } from './components/CdnManagementTab';
import { EdgeFunctionsTab } from './components/EdgeFunctionsTab';
import { TrafficAnalyticsTab } from './components/TrafficAnalyticsTab';
import { CacheManagementTab } from './components/CacheManagementTab';
import { SecurityTab } from './components/SecurityTab';
import { AiAssistantTab } from './components/AiAssistantTab';
import { ApiKeysTab } from './components/ApiKeysTab';
import { SettingsTab } from './components/SettingsTab';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  initialWorkspaces,
  initialNodes,
  initialDomains,
  initialCacheRules,
  initialEdgeFunctions,
  initialNetworkData,
  initialAnalyticsData,
  initialSecurityData,
  initialCacheData
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>(initialWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(initialWorkspaces[0]);
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [networkData, setNetworkData] = useState<any>(initialNetworkData);
  const [cdnData, setCdnData] = useState<any>({ domains: initialDomains, cacheRules: initialCacheRules });
  const [cacheData, setCacheData] = useState<any>(initialCacheData);
  const [functionsList, setFunctionsList] = useState<any[]>(initialEdgeFunctions);
  const [analyticsData, setAnalyticsData] = useState<any>(initialAnalyticsData);
  const [securityData, setSecurityData] = useState<any>(initialSecurityData);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Threshold state
  const [cpuThreshold, setCpuThreshold] = useState(80);
  const [memThreshold, setMemThreshold] = useState(80);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Threshold monitoring effect
  useEffect(() => {
    const interval = setInterval(() => {
      (nodes || []).forEach(node => {
        if (node.status === 'healthy') {
          if (node.cpu > cpuThreshold) {
            addToast(`Alert: Node ${node.name} CPU (${node.cpu}%) exceeded threshold (${cpuThreshold}%)`, 'error');
          }
          if (node.memory > memThreshold) {
            addToast(`Alert: Node ${node.name} Memory (${node.memory}%) exceeded threshold (${memThreshold}%)`, 'error');
          }
        }
      });
    }, 20000);
    return () => clearInterval(interval);
  }, [nodes, cpuThreshold, memThreshold]);

  // Fetch initial data from backend API routes if available, without blocking or crashing
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const fetchJson = async (url: string) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const ct = res.headers.get("content-type");
          if (!ct || !ct.includes("application/json")) {
            throw new Error("Response not JSON");
          }
          return res.json();
        };

        const [wsRes, nodesRes, netRes, cdnRes, cacheRes, funcRes, anaRes, secRes] = await Promise.allSettled([
          fetchJson('/api/workspaces'),
          fetchJson('/api/nodes'),
          fetchJson('/api/network'),
          fetchJson('/api/cdn'),
          fetchJson('/api/cache'),
          fetchJson('/api/functions'),
          fetchJson('/api/analytics'),
          fetchJson('/api/security'),
        ]);

        if (!isMounted) return;

        if (wsRes.status === 'fulfilled' && Array.isArray(wsRes.value) && wsRes.value.length > 0) {
          setWorkspaces(wsRes.value);
          setCurrentWorkspace(wsRes.value[0]);
        }
        if (nodesRes.status === 'fulfilled' && Array.isArray(nodesRes.value) && nodesRes.value.length > 0) {
          setNodes(nodesRes.value);
        }
        if (netRes.status === 'fulfilled' && netRes.value) {
          setNetworkData(netRes.value);
        }
        if (cdnRes.status === 'fulfilled' && cdnRes.value) {
          setCdnData(cdnRes.value);
        }
        if (cacheRes.status === 'fulfilled' && cacheRes.value) {
          setCacheData(cacheRes.value);
        }
        if (funcRes.status === 'fulfilled' && Array.isArray(funcRes.value) && funcRes.value.length > 0) {
          setFunctionsList(funcRes.value);
        }
        if (anaRes.status === 'fulfilled' && anaRes.value) {
          setAnalyticsData(anaRes.value);
        }
        if (secRes.status === 'fulfilled' && secRes.value) {
          setSecurityData(secRes.value);
        }
      } catch (err) {
        // Fallbacks already in place
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers for Node Management
  const handleAddNode = async (newNode: { name: string; region: string; ip: string }) => {
    const createdNode = {
      id: `node-${Math.random().toString(36).substring(2, 7)}`,
      name: newNode.name,
      region: newNode.region,
      ip: newNode.ip,
      status: "healthy",
      cpu: Math.floor(Math.random() * 35) + 20,
      memory: Math.floor(Math.random() * 35) + 30,
      bandwidth: "1.2 TB/s",
      latency: `${Math.floor(Math.random() * 25) + 12}ms`,
      requestsPerSec: Math.floor(Math.random() * 10000) + 5000,
      availability: "100.0%",
      lastHeartbeat: "Just now"
    };

    setNodes(prev => [...prev, createdNode]);

    try {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNode)
      });
      if (res.ok) {
        const data = await res.json();
        setNodes(prev => prev.map(n => n.id === createdNode.id ? data : n));
      }
    } catch (err) {
      // Optimistic update retained
    }
  };

  const handleDeleteNode = async (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    try {
      await fetch(`/api/nodes/${id}`, { method: 'DELETE' });
    } catch (err) {
      // Optimistic update retained
    }
  };

  const handleUpdateNode = async (id: string, updates: any) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    try {
      await fetch(`/api/nodes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      // Optimistic update retained
    }
  };

  const handleBulkUpdateNodes = async (ids: string[], updates: any) => {
    setNodes(prev => prev.map(n => ids.includes(n.id) ? { ...n, ...updates } : n));
    try {
      await fetch('/api/nodes/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, updates })
      });
    } catch (err) {
      // Optimistic update retained
    }
  };

  const handleBulkDeleteNodes = async (ids: string[]) => {
    setNodes(prev => prev.filter(n => !ids.includes(n.id)));
    try {
      await fetch('/api/nodes/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
    } catch (err) {
      // Optimistic update retained
    }
  };

  // Handlers for CDN & Cache
  const handleAddDomain = async (domainObj: { domain: string; origin: string }) => {
    const createdDomain = {
      id: `dom-${Math.random().toString(36).substring(2, 7)}`,
      domain: domainObj.domain,
      origin: domainObj.origin,
      status: "active",
      ssl: "Active (TLS 1.3)",
      requests: "1.2M",
      bandwidth: "14 TB",
      cacheHitRatio: "92.0%"
    };

    setCdnData((prev: any) => ({
      ...prev,
      domains: [...(prev?.domains || []), createdDomain]
    }));

    try {
      const res = await fetch('/api/cdn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(domainObj)
      });
      if (res.ok) {
        const data = await res.json();
        setCdnData((prev: any) => ({
          ...prev,
          domains: prev.domains.map((d: any) => d.id === createdDomain.id ? data : d)
        }));
      }
    } catch (err) {
      // Optimistic update retained
    }
  };

  const handlePurgeCache = async (scope: string, target: string) => {
    try {
      await fetch('/api/cdn/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, target })
      });
    } catch (err) {
      // Fallback
    }
  };

  // Handlers for Functions
  const handleAddFunction = async (fn: { name: string; runtime: string; triggers: string; code: string }) => {
    const createdFunc = {
      id: `func-${Math.random().toString(36).substring(2, 7)}`,
      name: fn.name,
      runtime: fn.runtime || "JavaScript (V8 Isolate)",
      status: "deployed",
      triggers: fn.triggers || "/*",
      lastModified: "Just now",
      invocations: "1.5K / day",
      code: fn.code
    };

    setFunctionsList(prev => [...prev, createdFunc]);

    try {
      const res = await fetch('/api/functions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fn)
      });
      if (res.ok) {
        const data = await res.json();
        setFunctionsList(prev => prev.map(f => f.id === createdFunc.id ? data : f));
      }
    } catch (err) {
      // Optimistic update retained
    }
  };

  const handleDeployFunction = async (id: string) => {
    setFunctionsList(prev => prev.map(f => f.id === id ? { ...f, status: 'deployed', lastModified: 'Just now' } : f));
    try {
      await fetch(`/api/functions/${id}/deploy`, { method: 'POST' });
    } catch (err) {
      // Optimistic update retained
    }
  };

  const tabTitles: Record<string, string> = {
    overview: 'Infrastructure Overview',
    network: 'Global Network Topology',
    nodes: 'Edge Node Fleet',
    cdn: 'CDN Management & Zones',
    functions: 'Edge Functions (Workers)',
    analytics: 'Traffic Analytics',
    cache: 'Cache Management & Purge',
    security: 'Security Center & WAF',
    assistant: 'AI Network Assistant',
    apikeys: 'API Integration Keys',
    settings: 'Workspace Settings'
  };

  const activeWorkspace = currentWorkspace || workspaces[0] || initialWorkspaces[0];

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          workspaces={workspaces.length > 0 ? workspaces : initialWorkspaces}
          currentWorkspace={activeWorkspace}
          onSelectWorkspace={setCurrentWorkspace}
          activeTabTitle={tabTitles[activeTab] || 'Dashboard'}
          nodes={nodes}
          domains={cdnData?.domains || initialDomains}
          cacheRules={cdnData?.cacheRules || initialCacheRules}
          functionsList={functionsList}
          onNavigate={(tab: string) => setActiveTab(tab)}
          addToast={addToast}
        />

        <main className="flex-1 overflow-y-auto p-8 bg-[#080B12]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} nodes={nodes} />}
            {activeTab === 'network' && <GlobalNetworkTab networkData={networkData} />}
            {activeTab === 'nodes' && (
              <EdgeNodesTab
                nodes={nodes}
                onAddNode={handleAddNode}
                onDeleteNode={handleDeleteNode}
                onUpdateNode={handleUpdateNode}
                onBulkUpdateNodes={handleBulkUpdateNodes}
                onBulkDeleteNodes={handleBulkDeleteNodes}
                addToast={addToast}
              />
            )}
            {activeTab === 'cdn' && (
              <CdnManagementTab
                cdnData={cdnData}
                onAddDomain={handleAddDomain}
                onPurgeCache={handlePurgeCache}
                addToast={addToast}
              />
            )}
            {activeTab === 'functions' && (
              <EdgeFunctionsTab
                functionsList={functionsList}
                onAddFunction={handleAddFunction}
                onDeployFunction={handleDeployFunction}
                addToast={addToast}
              />
            )}
            {activeTab === 'analytics' && <TrafficAnalyticsTab analyticsData={analyticsData} addToast={addToast} />}
            {activeTab === 'cache' && <CacheManagementTab cacheData={cacheData} onPurgeCache={handlePurgeCache} addToast={addToast} />}
            {activeTab === 'security' && <SecurityTab securityData={securityData} addToast={addToast} />}
            {activeTab === 'assistant' && <AiAssistantTab nodes={nodes} addToast={addToast} />}
            {activeTab === 'apikeys' && <ApiKeysTab addToast={addToast} />}
            {activeTab === 'settings' && (
              <SettingsTab
                currentWorkspace={activeWorkspace}
                cpuThreshold={cpuThreshold}
                setCpuThreshold={setCpuThreshold}
                memThreshold={memThreshold}
                setMemThreshold={setMemThreshold}
                addToast={addToast}
              />
            )}
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
