import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SecurityTabProps {
  securityData: any;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ securityData, addToast }) => {
  const events = securityData?.events || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Security & WAF Defense Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise DDoS protection, Web Application Firewall (WAF), TLS 1.3 encryption, and anomaly detection.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          Shield Active (Adaptive ML)
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">SSL / TLS Status</div>
            <div className="text-sm font-bold text-white mt-0.5">100% Valid (TLS 1.3)</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Auto-renewing certificates</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#3985FF]/10 text-[#3985FF] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">DDoS Mitigation</div>
            <div className="text-sm font-bold text-white mt-0.5">Layer 7 Adaptive Shield</div>
            <div className="text-[10px] text-sky-400 font-mono mt-1">14.2M req/sec capacity</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">WAF Firewall Rules</div>
            <div className="text-sm font-bold text-white mt-0.5">48 Active Rules</div>
            <div className="text-[10px] text-purple-300 font-mono mt-1">OWASP Top 10 Protected</div>
          </div>
        </div>
      </div>

      {/* Security Events Table */}
      <div className="rounded-2xl bg-[#101522] border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-[#0c101a] flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">Recent Security & WAF Events</h3>
          <button
            onClick={() => addToast('IP Denylist rules updated successfully.', 'success')}
            className="text-xs text-[#3985FF] hover:underline font-medium"
          >
            Configure WAF Rules
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0c101a]/50 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Event Type</th>
                <th className="py-3.5 px-4">Source IP / Country</th>
                <th className="py-3.5 px-4">Target Path</th>
                <th className="py-3.5 px-4">Action Taken</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {events.map((ev: any) => (
                <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    {ev.type}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    {ev.sourceIP} <span className="text-[10px] text-slate-400">({ev.country})</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-sky-300 truncate max-w-xs">
                    {ev.target}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {ev.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-amber-400">
                    {ev.riskScore}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-slate-400">
                    {ev.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
