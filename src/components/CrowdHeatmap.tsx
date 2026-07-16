import { useState, useEffect } from 'react';
import { Eye, Sparkles, Activity, RefreshCw } from 'lucide-react';

interface CrowdHeatmapProps {
  scenario: string;
}

export default function CrowdHeatmap({ scenario }: CrowdHeatmapProps) {
  const [inflow, setInflow] = useState<number>(65);
  const [bottleneck, setBottleneck] = useState<number>(40);
  const [commentary, setCommentary] = useState<string>('');

  // Sync simulation triggers from parent dashboard
  useEffect(() => {
    if (scenario === 'Heavy Rain') {
      setInflow(85);
      setBottleneck(70);
    } else if (scenario === 'Gate B Blockage') {
      setInflow(75);
      setBottleneck(100);
    } else {
      setInflow(60);
      setBottleneck(25);
    }
  }, [scenario]);

  // Compute AI commentary based on slider inputs
  useEffect(() => {
    let text = '';
    if (bottleneck >= 80) {
      text = "🚨 CRITICAL CROWD BLOCKAGE DETECTED: Gate B bottleneck is at extreme capacity due to terminal gate closure. Inbound crowd backup is estimated at 12 minutes. AI routing protocol has initiated: re-directing new arrivals to Gate A & D via digital stadium screens. Standby stewards have been dispatched to Gate B exit lanes.";
    } else if (inflow >= 80) {
      text = "⚠️ HIGH DEMAND PREDICTION: High stadium entry rate detected (kickoff approaching). Main concourse corridors (Sec 104-106) are reaching peak occupancy (0.8 persons/sqm). AI recommend keeping all upward escalators active, delaying ticket-tier promotions, and holding shuttle bus zone departures to balance plaza outflow.";
    } else if (bottleneck >= 50) {
      text = "⚡ MODERATE CONGESTION: Concourse sectors near Gate B are filling up. Food concession stands behind Section 112 are experiencing high local queues. Advise fans via their StadiaFlow mobile app to head to Section 105 concessions (wait times under 2 minutes).";
    } else {
      text = "✅ SYSTEM NORMAL: Crowd movement is within safety tolerances. Average transit times stand at 3.2 minutes. Concorse circulation speed is nominal (1.1 m/s). Continual predictive scanning active.";
    }
    setCommentary(text);
  }, [inflow, bottleneck]);

  // Simple helper to calculate fill color based on density level
  const getSectionColor = (sectionId: string, baseDensity: number) => {
    // Some sections are more prone to overcrowding near Gate B (e.g. 103, 104, 105)
    let weight = 1.0;
    if (sectionId === '103' || sectionId === '104' || sectionId === '105') {
      weight = 1.0 + (bottleneck / 50);
    }
    const density = Math.min((baseDensity * inflow * weight) / 100, 100);

    if (density > 85) return 'rgba(239, 68, 68, 0.85)'; // Red
    if (density > 60) return 'rgba(245, 166, 35, 0.8)';  // Orange
    if (density > 35) return 'rgba(59, 130, 246, 0.7)';  // Blue
    return 'rgba(16, 185, 129, 0.6)'; // Green
  };

  const resetSliders = () => {
    setInflow(60);
    setBottleneck(25);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      {/* Left Column: Interactive Heatmap Simulator Parameters */}
      <div className="md:col-span-5 flex flex-col gap-5">
        <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)] glow-blue">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="text-[#3B82F6]" size={20} />
              Crowd Parameters
            </h3>
            <button
              onClick={resetSliders}
              className="text-[10px] uppercase font-bold text-[#9CA3AF] hover:text-white flex items-center gap-1 cursor-pointer"
              aria-label="Reset parameters"
            >
              <RefreshCw size={11} />
              Reset
            </button>
          </div>

          {/* Slider 1: Inflow */}
          <div className="mb-5">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#9CA3AF]">Pedestrian Inflow Rate:</span>
              <span className="text-white">{inflow}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={inflow}
              onChange={(e) => setInflow(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
              aria-label="Inflow rate"
            />
            <span className="text-[10px] text-[#9CA3AF] block mt-1">Adjusts the volume of incoming ticket holders entering the gates.</span>
          </div>

          {/* Slider 2: Gate Bottlenecks */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#9CA3AF]">Gate B Congestion Level:</span>
              <span className="text-white">{bottleneck}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bottleneck}
              onChange={(e) => setBottleneck(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#EF4444]"
              aria-label="Gate bottleneck"
            />
            <span className="text-[10px] text-[#9CA3AF] block mt-1">Simulates queue buildup, gate delays, or hardware failure at Gate B entrance.</span>
          </div>
        </div>

        {/* AI Predictive Commentary (Low latency response check) */}
        <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)] flex-1">
          <h3 className="text-sm font-semibold text-white mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="text-[#F5A623]" size={16} />
            Predictive AI Commentary
          </h3>
          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-xs leading-relaxed text-[#F3F4F6] min-h-[120px] flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 animate-ping"></div>
            <p className="flex-1">{commentary}</p>
          </div>
        </div>
      </div>

      {/* Right Column: Heatmap Visualization map */}
      <div className="md:col-span-7 flex flex-col">
        <div className="glass-container p-6 flex-1 flex flex-col justify-center items-center relative border border-[rgba(59,130,246,0.15)] min-h-[400px]">
          <span className="text-xs text-[#9CA3AF] absolute top-4 left-4 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1">
            <Eye size={12} className="text-[#10B981]" />
            Live Crowd Heatmap
          </span>

          <div className="w-full relative mt-6 flex justify-center">
            <svg viewBox="0 0 400 400" className="stadium-svg max-w-[360px]">
              {/* Outer boundary */}
              <circle cx="200" cy="200" r="170" fill="none" stroke="#1F2E4D" strokeWidth="4" />
              
              {/* Stadium Sections (101 to 112) colored by computed density */}
              {['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112'].map((secKey) => {
                // Base densities for different sections
                let base = 30; // standard base
                if (secKey === '104') base = 70; // Gate B entrance sector
                if (secKey === '103' || secKey === '105') base = 50; // sectors near Gate B
                if (secKey === '101' || secKey === '107') base = 40; // other entrances

                const color = getSectionColor(secKey, base);
                const xVal = secKey === '101' ? 200 : secKey === '102' ? 270 : secKey === '103' ? 320 : secKey === '104' ? 340 : secKey === '105' ? 320 : secKey === '106' ? 270 : secKey === '107' ? 200 : secKey === '108' ? 130 : secKey === '109' ? 80 : secKey === '110' ? 60 : secKey === '111' ? 80 : 130;
                const yVal = secKey === '101' ? 90 : secKey === '102' ? 110 : secKey === '103' ? 150 : secKey === '104' ? 200 : secKey === '105' ? 250 : secKey === '106' ? 290 : secKey === '107' ? 310 : secKey === '108' ? 290 : secKey === '109' ? 250 : secKey === '110' ? 200 : secKey === '111' ? 150 : 110;

                return (
                  <g key={`heatmap-${secKey}`}>
                    <circle
                      cx={xVal}
                      cy={yVal}
                      r="24"
                      style={{
                        fill: color,
                        stroke: '#0F172A',
                        strokeWidth: '1.5px',
                        transition: 'fill 0.4s ease'
                      }}
                    />
                    <text
                      x={xVal}
                      y={yVal}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {secKey}
                    </text>
                  </g>
                );
              })}

              {/* Pitch Area */}
              <rect x="140" y="150" width="120" height="100" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="2" opacity="0.8" />
              <line x1="200" y1="150" x2="200" y2="250" stroke="#475569" strokeWidth="1" strokeDasharray="2" />
              <circle cx="200" cy="200" r="20" fill="none" stroke="#475569" strokeWidth="1.5" />

              {/* Gate Entry Points (Heat nodes) */}
              <circle cx="200" cy="50" r="10" fill={getSectionColor('101', 35)} stroke="#fff" strokeWidth="1.5" />
              <circle cx="350" cy="200" r="10" fill={bottleneck > 70 ? '#EF4444' : getSectionColor('104', 55)} stroke="#fff" strokeWidth="1.5" />
              <circle cx="200" cy="350" r="10" fill={getSectionColor('107', 35)} stroke="#fff" strokeWidth="1.5" />
              <circle cx="50" cy="200" r="10" fill={getSectionColor('110', 35)} stroke="#fff" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Color scale legend */}
          <div className="flex gap-4 mt-6 text-xs text-[#9CA3AF] border-t border-slate-800 pt-4 w-full justify-center">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[rgba(16,185,129,0.6)] inline-block"></span>
              <span>Low (0-30%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[rgba(59,130,246,0.7)] inline-block"></span>
              <span>Normal (30-60%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[rgba(245,166,35,0.8)] inline-block"></span>
              <span>Warning (60-80%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[rgba(239,68,68,0.85)] inline-block"></span>
              <span>Overcrowded (&gt;80%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
