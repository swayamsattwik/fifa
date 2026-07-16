import { useState } from 'react';
import { Leaf, Award, Recycle, Sparkles, Truck, Check } from 'lucide-react';

interface FoodLog {
  vendor: string;
  section: string;
  item: string;
  qty: number;
}

const SURPLUS_LOGS: FoodLog[] = [
  { vendor: 'Kickoff Tacos', section: '112', item: 'Gluten-free tortillas & beans', qty: 45 },
  { vendor: 'Stadium Grill', section: '105', item: 'Premium Beef Buns', qty: 72 },
  { vendor: 'Corner Cafe', section: '115', item: 'Fresh Jumbo Pretzels', qty: 30 },
];

export default function SustainabilityHub() {
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<any | null>(null);

  const triggerOptimization = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimizedResult({
        thought: "Analyzing organic shelf-life matrices. Temperature is 22°C; hot dogs and buns must be transported in insulated cooling bins. Shelter database indicates Rutherford Family Haven (2.1 miles away) has a vacancy for 120 meals, and Community Table (4.5 miles) has a vacancy for 150 meals. Scheduling collection van route...",
        donations: [
          { shelter: 'Rutherford Family Haven', qty: 117, items: 'Beef Buns & Pretzels', eta: '18 mins' },
          { shelter: 'Community Table', qty: 30, items: 'Gluten-free tortillas', eta: '32 mins' }
        ],
        impact: "Saves 147 lbs of carbon equivalent emissions; redirects 147 meals to families in need."
      });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      {/* Left Column: Sustainability Stats meters */}
      <div className="md:col-span-6 flex flex-col gap-5">
        <div className="glass-container p-6 border border-[rgba(59,130,246,0.15)] glow-blue">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Leaf className="text-[#10B981]" size={20} />
            Environmental KPI Meters
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Solar meter */}
            <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl text-center flex flex-col items-center">
              <div className="circular-meter mb-2">
                <svg className="circular-meter-svg">
                  <circle className="circular-meter-bg" cx="60" cy="60" r="50" />
                  <circle 
                    className="circular-meter-val" 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.42)}`}
                    style={{ stroke: '#F5A623' }}
                  />
                </svg>
                <div className="circular-meter-text text-[#F5A623]">42%</div>
              </div>
              <span className="text-xs font-bold text-white">Solar Offsets</span>
              <span className="text-[10px] text-[#9CA3AF] mt-0.5">85kW / 200kW capacity</span>
            </div>

            {/* Recycling meter */}
            <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl text-center flex flex-col items-center">
              <div className="circular-meter mb-2">
                <svg className="circular-meter-svg">
                  <circle className="circular-meter-bg" cx="60" cy="60" r="50" />
                  <circle 
                    className="circular-meter-val" 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.76)}`}
                    style={{ stroke: '#10B981' }}
                  />
                </svg>
                <div className="circular-meter-text text-[#10B981]">76%</div>
              </div>
              <span className="text-xs font-bold text-white">Recycling Rate</span>
              <span className="text-[10px] text-[#9CA3AF] mt-0.5">Aluminum & compost focus</span>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl flex gap-3 items-center text-xs">
            <Award className="text-[#F5A623] shrink-0" size={18} />
            <span className="text-[#9CA3AF]">
              <strong>Stadium Status:</strong> On track for <strong>LEED Gold Certification</strong> standards for the tournament. Water reclaim flow is at 98% efficiency.
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: GenAI Surplus Food redistribution optimizer */}
      <div className="md:col-span-6 flex flex-col gap-5">
        <div className="glass-container p-6 border border-[rgba(59,130,246,0.15)] flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Recycle className="text-[#06B6D4]" size={20} />
            Food Waste Optimizer
          </h3>
          <p className="text-xs text-[#9CA3AF] mb-4">
            GenAI tracks real-time concession surplus and schedules automated donation transfers to local communities, bypassing composting waste.
          </p>

          {/* Live excess logs list */}
          <div className="mb-4 bg-slate-950/30 border border-slate-900 rounded-xl p-3.5">
            <span className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider block mb-2">Concession Excess Logs</span>
            <div className="flex flex-col gap-2">
              {SURPLUS_LOGS.map((log, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-900 pb-1.5 last:border-b-0 last:pb-0">
                  <div>
                    <span className="font-semibold text-white block">{log.vendor}</span>
                    <span className="text-[10px] text-[#9CA3AF]">{log.item}</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded border border-slate-700 font-semibold">
                    {log.qty} units
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger button */}
          {!optimizedResult && (
            <button
              onClick={triggerOptimization}
              disabled={optimizing}
              className="btn-primary w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              aria-label="Optimize food redistribution"
            >
              {optimizing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Calculating shelf-life and shelter routes...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Optimize Redistribution
                </>
              )}
            </button>
          )}

          {/* Optimization Results Panel */}
          {optimizedResult && (
            <div className="flex flex-col gap-3.5 flex-1">
              {/* Reasoning */}
              <div className="p-3 bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.15)] rounded-lg">
                <span className="text-[9px] uppercase font-bold text-[#F5A623] block mb-1">AI Routing thought</span>
                <p className="text-[10px] leading-relaxed text-[#F3F4F6] italic">{optimizedResult.thought}</p>
              </div>

              {/* Scheduled Donations */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider block">Donation Dispatch Plan</span>
                {optimizedResult.donations.map((don: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                    <div className="flex gap-2 items-center">
                      <Truck className="text-[#10B981]" size={14} />
                      <div>
                        <span className="font-semibold text-white block">{don.shelter}</span>
                        <span className="text-[10px] text-[#9CA3AF]">{don.items}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#10B981] block">+{don.qty} Meals</span>
                      <span className="text-[9px] text-[#9CA3AF]">ETA: {don.eta}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carbon saved */}
              <div className="mt-auto p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                  <Check size={14} />
                  <span>Saves 147 lbs waste</span>
                </div>
                <button
                  onClick={() => setOptimizedResult(null)}
                  className="text-[10px] text-[#9CA3AF] hover:text-white underline cursor-pointer"
                  aria-label="Recalculate route"
                >
                  Recalculate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
