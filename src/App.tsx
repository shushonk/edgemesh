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

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [networkData, setNetworkData] = useState<any>(null);
  const [cdnData, setCdnData] = useState<any>(null);
  const [cacheData, setCacheData] = useState<any>(null);
  const [functionsList, setFunctionsList] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [securityData, setSecurityData] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      nodes.forEach(node => {
        if (node.status === 'healthy') {
          if (node.cpu > cpuThreshold) {
            addToast(`Alert: Node ${node.name} CPU (${node.cpu}%) exceeded threshold (${cpuThreshold}%)`, 'error');
          }
          if (node.memory > memThreshold) {
            addToast(`Alert: Node ${node.name} Memory (${node.memory}%) exceeded threshold (${memThreshold}%)`, 'error');
          }
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [nodes, cpuThreshold, memThreshold]);


  // Fetch initial data from backend API routes
  useEffect(() => {
    async function loadData() {
      try {
        const [wsRes, nodesRes, netRes, cdnRes, cacheRes, funcRes, anaRes, secRes] = await Promise.all([
          fetch('/api/workspaces').then(r => r.json()),
          fetch('/api/nodes').then(r => r.json()),
          fetch('/api/network').then(r => r.json()),
          fetch('/api/cdn').then(r => r.json()),
          fetch('/api/cache').then(r => r.json()),
          fetch('/api/functions').then(r => r.json()),
          fetch('/api/analytics').then(r => r.json()),
          fetch('/api/security').then(r => r.json()),
        ]);

        setWorkspaces(wsRes);
        setCurrentWorkspace(wsRes[0] || { id: 'ws-1', name: 'Global Production', plan: 'Enterprise' });
        setNodes(nodesRes);
        setNetworkData(netRes);
        setCdnData(cdnRes);
        setCacheData(cacheRes);
        setFunctionsList(funcRes);
        setAnalyticsData(anaRes);
        setSecurityData(secRes);
      } catch (err) {
        console.error("Failed to load EdgeMesh backend data:", err);
        addToast('Failed to load initial infrastructure telemetry.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handlers for Node Management
  const handleAddNode = async (newNode: { name: string; region: string; ip: string }) => {
    try {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNode)
      });
      const data = await res.json();
      setNodes(prev => [...prev, data]);
    } catch (err) {
      console.error(err);
      addToast('Failed to register node.', 'error');
    }
  };

  const handleDeleteNode = async (id: string) => {
    try {
      await fetch(`/api/nodes/${id}`, { method: 'DELETE' });
      setNodes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      addToast('Failed to delete node.', 'error');
    }
  };

  const handleUpdateNode = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/nodes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setNodes(prev => prev.map(n => n.id === id ? updated : n));
    } catch (err) {
      console.error(err);
      addToast('Failed to update node.', 'error');
    }
  };

  const handleBulkUpdateNodes = async (ids: string[], updates: any) => {
    try {
      await fetch('/api/nodes/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, updates })
      });
      setNodes(prev => prev.map(n => ids.includes(n.id) ? { ...n, ...updates } : n));
    } catch (err) {
      console.error(err);
      addToast('Failed to perform bulk update.', 'error');
    }
  };

  const handleBulkDeleteNodes = async (ids: string[]) => {
    try {
      await fetch('/api/nodes/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      setNodes(prev => prev.filter(n => !ids.includes(n.id)));
    } catch (err) {
      console.error(err);
      addToast('Failed to perform bulk delete.', 'error');
    }
  };

  // Handlers for CDN & Cache
  const handleAddDomain = async (domainObj: { domain: string; origin: string }) => {
    try {
      const res = await fetch('/api/cdn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(domainObj)
      });
      const data = await res.json();
      setCdnData((prev: any) => ({ ...prev, domains: [...(prev?.domains || []), data] }));
    } catch (err) {
      console.error(err);
      addToast('Failed to add CDN domain.', 'error');
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
      console.error(err);
    }
  };

  // Handlers for Functions
  const handleAddFunction = async (fn: { name: string; runtime: string; triggers: string; code: string }) => {
    try {
      const res = await fetch('/api/functions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fn)
      });
      const data = await res.json();
      setFunctionsList(prev => [...prev, data]);
    } catch (err) {
      console.error(err);
      addToast('Failed to create edge function.', 'error');
    }
  };

  const handleDeployFunction = async (id: string) => {
    try {
      await fetch(`/api/functions/${id}/deploy`, { method: 'POST' });
      setFunctionsList(prev => prev.map(f => f.id === id ? { ...f, status: 'deployed', lastModified: 'Just now' } : f));
    } catch (err) {
      console.error(err);
      addToast('Failed to deploy function.', 'error');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B12] text-slate-100 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#3985FF] animate-ping"></div>
          <span>Loading EdgeMesh Global Control Plane...</span>
        </div>
      </div>
    );
  }

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
          workspaces={workspaces}
          currentWorkspace={currentWorkspace || workspaces[0]}
          onSelectWorkspace={setCurrentWorkspace}
          activeTabTitle={tabTitles[activeTab] || 'Dashboard'}
          nodes={nodes}
          domains={cdnData?.domains || []}
          cacheRules={cdnData?.cacheRules || []}
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
                currentWorkspace={currentWorkspace}
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
};
