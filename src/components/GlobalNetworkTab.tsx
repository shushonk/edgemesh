import React, { useState, useEffect, useRef } from 'react';
import { Globe, Server, Activity, ShieldCheck, MapPin, ChevronRight, RefreshCw } from 'lucide-react';
import * as d3 from 'd3';

interface GlobalNetworkTabProps {
  networkData: any;
}

export const GlobalNetworkTab: React.FC<GlobalNetworkTabProps> = ({ networkData }) => {
  const [selectedRegion, setSelectedRegion] = useState<any>(networkData?.regions?.[0] || null);
  const svgRef = useRef<SVGSVGElement>(null);

  const regions = networkData?.regions || [
    { name: "North America", nodeCount: 2, status: "healthy", avgLatency: "16ms", rps: "32,700 req/s", bandwidth: "10.0 TB/s", availability: "99.98%" },
    { name: "South America", nodeCount: 1, status: "healthy", avgLatency: "38ms", rps: "6,400 req/s", bandwidth: "1.9 TB/s", availability: "99.95%" },
    { name: "Europe", nodeCount: 2, status: "healthy", avgLatency: "13ms", rps: "45,200 req/s", bandwidth: "15.5 TB/s", availability: "99.99%" },
    { name: "Asia", nodeCount: 1, status: "healthy", avgLatency: "22ms", rps: "19,800 req/s", bandwidth: "6.9 TB/s", availability: "99.97%" },
    { name: "Southeast Asia", nodeCount: 1, status: "healthy", avgLatency: "25ms", rps: "11,500 req/s", bandwidth: "3.5 TB/s", availability: "99.96%" },
    { name: "India", nodeCount: 1, status: "degraded", avgLatency: "42ms", rps: "9,200 req/s", bandwidth: "2.8 TB/s", availability: "99.82%" },
    { name: "Africa", nodeCount: 1, status: "healthy", avgLatency: "52ms", rps: "3,800 req/s", bandwidth: "1.1 TB/s", availability: "99.90%" },
    { name: "Australia", nodeCount: 1, status: "healthy", avgLatency: "31ms", rps: "7,900 req/s", bandwidth: "2.4 TB/s", availability: "99.98%" }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const nodes = regions.map((r: any, i: number) => ({ id: i, name: r.name, group: r.status }));
    const links = regions.map((_: any, i: number) => ({ source: 0, target: i })).filter((l: any) => l.source !== l.target);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#3985FF')
      .attr('stroke-opacity', 0.6);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 8)
      .attr('fill', (d: any) => d.group === 'healthy' ? '#10b981' : '#f59e0b');

    simulation.on('tick', () => {
      link.attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);
      node.attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
    });
  }, [regions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Global Network Topology</h2>
          <p className="text-xs text-slate-400 mt-1">
            Anycast routing matrix across 8 global regions with real-time health monitoring and automated failover.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Anycast IP: 198.51.100.1 active
          </div>
        </div>
      </div>

      {/* World Map Interactive Grid Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Anycast PoP Regional Map (D3 Force Graph)</h3>
          </div>

          <div className="relative flex-1 bg-[#080B12]/80 rounded-xl border border-slate-800/80 p-6 flex items-center justify-center overflow-hidden">
            <svg ref={svgRef} className="w-full h-full"></svg>
          </div>
          
          <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Healthy PoPs
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-2"></span> Degraded PoP (Mumbai)
            </span>
            <span className="font-mono">Routing Protocol: BGP Anycast</span>
          </div>
        </div>

        {/* Selected Region Detailed Panel */}
        <div className="p-6 rounded-2xl bg-[#101522] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#3985FF]" />
                <h3 className="text-sm font-bold text-white">{selectedRegion?.name || 'Select Region'}</h3>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-mono rounded uppercase ${
                selectedRegion?.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {selectedRegion?.status || 'Active'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400">Active Edge Nodes</span>
                <span className="text-xs font-mono font-bold text-white">{selectedRegion?.nodeCount} Node(s)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400">Average Latency</span>
                <span className="text-xs font-mono font-bold text-sky-400">{selectedRegion?.avgLatency}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400">Requests / Sec</span>
                <span className="text-xs font-mono font-bold text-white">{selectedRegion?.rps}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400">Bandwidth Throughput</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{selectedRegion?.bandwidth}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400">SLA Availability</span>
                <span className="text-xs font-mono font-bold text-white">{selectedRegion?.availability}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => alert(`Initiating BGP route rebalance for ${selectedRegion?.name}...`)}
              className="w-full py-2.5 bg-[#3985FF] hover:bg-[#3985FF]/90 text-white text-xs font-medium rounded-xl transition-all shadow-lg shadow-[#3985FF]/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Rebalance BGP Routes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
