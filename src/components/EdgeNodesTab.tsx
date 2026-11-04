import React, { useState } from 'react';
import { Server, Plus, Edit3, Trash2, Power, Activity, Terminal, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface EdgeNodesTabProps {
  nodes: any[];
  onAddNode: (node: { name: string; region: string; ip: string }) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNode: (id: string, updates: any) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const EdgeNodesTab: React.FC<EdgeNodesTabProps> = ({
  nodes,
  onAddNode,
  onDeleteNode,
  onUpdateNode,
  addToast
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState<any>(null);
  const [name, setName] = useState('');
  const [region, setRegion] = useState('North America');
  const [ip, setIp] = useState('198.51.100.');

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

      {/* Nodes Table */}
      <div className="rounded-2xl bg-[#101522] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0c101a] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Node ID & Name</th>
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
                const isHealthy = node.status === 'healthy';
                return (
                  <tr key={node.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium ${
                        isHealthy ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                        {node.status}
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
                          className={`p-1.5 rounded-lg transition-colors ${node.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'}`}
                          title="Enable / Disable Node"
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
