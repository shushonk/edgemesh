import React, { useState } from 'react';
import {
  Server,
  Plus,
  Trash2,
  Power,
  Activity,
  Terminal,
  CheckCircle2,
  X,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface EdgeNodesTabProps {
  nodes: any[];
  onAddNode: (node: { name: string; region: string; ip: string }) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNode: (id: string, updates: any) => void;
  onBulkUpdateNodes?: (ids: string[], updates: any) => void;
  onBulkDeleteNodes?: (ids: string[]) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const EdgeNodesTab: React.FC<EdgeNodesTabProps> = ({
  nodes,
  onAddNode,
  onDeleteNode,
  onUpdateNode,
  onBulkUpdateNodes,
  onBulkDeleteNodes,
  addToast
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState<any>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  // Add form fields
  const [name, setName] = useState('');
  const [region, setRegion] = useState('North America');
  const [ip, setIp] = useState('198.51.100.');

  const isAllSelected = nodes.length > 0 && selectedNodeIds.length === nodes.length;
  const isPartiallySelected = selectedNodeIds.length > 0 && selectedNodeIds.length < nodes.length;

  // Toggle selection for single node
  const handleToggleSelectNode = (id: string) => {
    setSelectedNodeIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNodeIds([]);
    } else {
      setSelectedNodeIds(nodes.map(n => n.id));
    }
  };

  // Bulk Enable
  const handleBulkEnable = () => {
    if (selectedNodeIds.length === 0) return;
    if (onBulkUpdateNodes) {
      onBulkUpdateNodes(selectedNodeIds, { status: 'healthy' });
    } else {
      selectedNodeIds.forEach(id => onUpdateNode(id, { status: 'healthy' }));
    }
    addToast(`Enabled ${selectedNodeIds.length} edge node(s) successfully.`, 'success');
    setSelectedNodeIds([]);
  };

  // Bulk Disable
  const handleBulkDisable = () => {
    if (selectedNodeIds.length === 0) return;
    if (onBulkUpdateNodes) {
      onBulkUpdateNodes(selectedNodeIds, { status: 'offline' });
    } else {
      selectedNodeIds.forEach(id => onUpdateNode(id, { status: 'offline' }));
    }
    addToast(`Disabled ${selectedNodeIds.length} edge node(s).`, 'info');
    setSelectedNodeIds([]);
  };

  // Bulk Delete
  const handleBulkDeleteConfirm = () => {
    if (selectedNodeIds.length === 0) return;
    const count = selectedNodeIds.length;
    if (onBulkDeleteNodes) {
      onBulkDeleteNodes(selectedNodeIds);
    } else {
      selectedNodeIds.forEach(id => onDeleteNode(id));
    }
    addToast(`Deleted ${count} edge node(s) from Anycast pool.`, 'success');
    setSelectedNodeIds([]);
    setShowBulkDeleteConfirm(false);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ip) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    onAddNode({ name, region, ip });
    setName('');
    setIp('198.51.100.');
    setShowAddModal(false);
    addToast('Edge node successfully registered and added to Anycast pool.', 'success');
  };

  // Helper for status visual styling and color-coded indicator dots
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'online':
        return {
          dotClass: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse',
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          label: 'Online'
        };
      case 'degraded':
        return {
          dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]',
          badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          label: 'Degraded'
        };
      case 'offline':
      default:
        return {
          dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]',
          badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          label: 'Offline'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Edge Node Fleet Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Register, configure, and monitor distributed edge servers, V8 isolate runtimes, and health metrics.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium rounded-xl transition-all shadow-lg shadow-[#3985FF]/20 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Register New Node
        </button>
      </div>

      {/* Floating or Docked Bulk Action Toolbar */}
      {selectedNodeIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#101522] via-[#0d162a] to-[#101522] border border-[#3985FF]/40 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#3985FF]/20 text-[#3985FF] font-mono text-xs font-bold flex items-center justify-center border border-[#3985FF]/30">
              {selectedNodeIds.length}
            </span>
            <div>
              <div className="text-xs font-bold text-white">
                {selectedNodeIds.length} edge node{selectedNodeIds.length > 1 ? 's' : ''} selected
              </div>
              <div className="text-[11px] text-slate-400">
                Choose a bulk operation to apply across all selected servers
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkEnable}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Enable Selected</span>
            </button>

            <button
              onClick={handleBulkDisable}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5 text-amber-400" />
              <span>Disable Selected</span>
            </button>

            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>

            <button
              onClick={() => setSelectedNodeIds([])}
              className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Nodes Table */}
      <div className="rounded-2xl bg-[#101522] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0c101a] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-slate-700 bg-[#080B12] text-[#3985FF] focus:ring-[#3985FF] focus:ring-offset-0 cursor-pointer accent-[#3985FF]"
                    title="Select All Nodes"
                  />
                </th>
                <th className="py-3.5 px-4">Node ID & Name</th>
                <th className="py-3.5 px-4">Region / IP</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">CPU / Memory</th>
                <th className="py-3.5 px-4">Throughput</th>
                <th className="py-3.5 px-4">Latency</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {nodes.map((node) => {
                const isSelected = selectedNodeIds.includes(node.id);
                const statusConfig = getStatusConfig(node.status);
                return (
                  <tr
                    key={node.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-[#3985FF]/10 hover:bg-[#3985FF]/15'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Checkbox column */}
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectNode(node.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-[#080B12] text-[#3985FF] focus:ring-[#3985FF] focus:ring-offset-0 cursor-pointer accent-[#3985FF]"
                      />
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Server className="w-4 h-4 text-[#3985FF]" />
                        {node.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{node.id}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-slate-200">{node.region}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{node.ip}</div>
                    </td>

                    {/* Color-coded Status Dot and Label */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border ${statusConfig.badgeClass}`}>
                        {/* Color-Coded Indicator Dot: Green for online, Amber for degraded, Red for offline */}
                        <span className={`w-2 h-2 rounded-full shrink-0 ${statusConfig.dotClass}`}></span>
                        <span>{statusConfig.label}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <div className="text-slate-200">{node.cpu}% CPU</div>
                      <div className="text-[10px] text-slate-400">{node.memory}% Mem</div>
                    </td>

                    <td className="py-4 px-4 font-mono text-emerald-400">
                      {node.bandwidth}
                    </td>

                    <td className="py-4 px-4 font-mono text-sky-300">
                      {node.latency}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setShowLogsModal(node)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View Node Logs"
                        >
                          <Terminal className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = node.status === 'healthy' ? 'offline' : 'healthy';
                            onUpdateNode(node.id, { status: newStatus });
                            addToast(`Node ${node.name} status toggled to ${newStatus}`, 'info');
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            node.status === 'healthy'
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                          }`}
                          title={node.status === 'healthy' ? 'Disable Node (Take Offline)' : 'Enable Node (Bring Online)'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onDeleteNode(node.id);
                            addToast(`Deleted node ${node.name}`, 'success');
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Node"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete {selectedNodeIds.length} Nodes?</h3>
                <span className="text-xs text-rose-400 font-mono">Destructive Anycast Fleet Action</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-4">
              You are about to delete <span className="font-bold text-white font-mono">{selectedNodeIds.length}</span> distributed edge node(s) from the active routing matrix. Traffic will automatically failover to neighboring Anycast PoPs.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-lg shadow-rose-600/20 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Bulk Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-[#3985FF]" /> Register Edge Node
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Node Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zurich Edge 02"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#3985FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Geographic Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#3985FF]"
                >
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Southeast Asia">Southeast Asia</option>
                  <option value="India">India</option>
                  <option value="Africa">Africa</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">IP Address (Anycast)</label>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="198.51.100.XX"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#3985FF]"
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
                  Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Node Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#16D9E8]" /> Node Telemetry & Logs
                </h3>
                <span className="text-xs font-mono text-slate-400">{showLogsModal.name} ({showLogsModal.ip})</span>
              </div>
              <button onClick={() => setShowLogsModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-[#080B12] rounded-xl p-4 font-mono text-xs text-sky-300 h-64 overflow-y-auto space-y-2 border border-slate-800">
              <div className="text-slate-500">[06:38:12 UTC] BGP announcer active on interface eth0</div>
              <div className="text-emerald-400">[06:38:15 UTC] Health check ping successful: latency {showLogsModal.latency}</div>
              <div className="text-slate-300">[06:38:20 UTC] V8 Isolate pool initialized (8 workers active)</div>
              <div className="text-sky-300">[06:38:28 UTC] Cache hit ratio steady at 95.8% for zone api.edgemesh.io</div>
              <div className="text-slate-300">[06:38:40 UTC] TLS 1.3 handshake completed for client connection from {showLogsModal.ip}</div>
              <div className="text-emerald-400">[06:38:50 UTC] Heartbeat acknowledged by global control plane. CPU: {showLogsModal.cpu}%, Mem: {showLogsModal.memory}%</div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowLogsModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
