import React from 'react';

interface DashboardWidgetProps {
  nodes: any[];
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ nodes }) => {
  return (
    <div className="p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
      <h3 className="text-sm font-bold text-white mb-6">Real-Time Fleet Utilization</h3>
      <div className="space-y-4">
        {nodes.map((node) => (
          <div key={node.id} className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span className="truncate w-1/3">{node.name}</span>
              <span>CPU: {node.cpu}%</span>
              <span>Mem: {node.memory}%</span>
            </div>
            <div className="flex gap-1 h-2">
              <div
                className="bg-[#3985FF] rounded-sm transition-all duration-500"
                style={{ width: `${node.cpu}%` }}
              ></div>
              <div
                className="bg-[#16D9E8] rounded-sm transition-all duration-500"
                style={{ width: `${node.memory}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
