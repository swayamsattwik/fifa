import { useState, useEffect } from 'react';
import { Search, Clock, Accessibility, Route } from 'lucide-react';

interface WayfinderMapProps {
  stadium: string;
  prefilledSection: string;
  gate: string;
}

interface Concession {
  id: string;
  name: string;
  section: string;
  type: string;
  waitTime: number;
  popular: string;
  tags: string[];
}

const CONCESSIONS: Concession[] = [
  { id: 'c1', name: 'Kickoff Tacos', section: '112', type: 'Mexican & Grill', waitTime: 4, popular: 'Spicy Chicken Taco', tags: ['Gluten-Free', 'Halal'] },
  { id: 'c2', name: 'Stadium Grill', section: '105', type: 'Burgers & Fries', waitTime: 8, popular: 'Championship Double Cheeseburger', tags: ['Halal', 'Kids Menu'] },
  { id: 'c3', name: 'Corner Cafe', section: '115', type: 'Coffee & Snacks', waitTime: 2, popular: 'Flat White & Jumbo Pretzel', tags: ['Vegetarian'] },
  { id: 'c4', name: 'World Cup Merch Hub', section: '109', type: 'Apparel & Souvenirs', waitTime: 15, popular: 'Official Match Jersey', tags: ['Express Checkout'] },
];

// Map sections to coordinates on our SVG map
const SECTION_COORDS: Record<string, { cx: number; cy: number; textX: number; textY: number; gate: string; path: string }> = {
  '101': { cx: 200, cy: 90, textX: 200, textY: 75, gate: 'Gate A', path: 'M 200,50 L 200,90' },
  '102': { cx: 270, cy: 110, textX: 280, textY: 95, gate: 'Gate A', path: 'M 200,50 Q 250,55 270,110' },
  '103': { cx: 320, cy: 150, textX: 340, textY: 145, gate: 'Gate B', path: 'M 350,200 Q 345,160 320,150' },
  '104': { cx: 340, cy: 200, textX: 360, textY: 205, gate: 'Gate B', path: 'M 350,200 L 340,200' },
  '105': { cx: 320, cy: 250, textX: 340, textY: 260, gate: 'Gate B', path: 'M 350,200 Q 345,240 320,250' },
  '106': { cx: 270, cy: 290, textX: 280, textY: 310, gate: 'Gate B', path: 'M 350,200 Q 300,320 270,290' },
  '107': { cx: 200, cy: 310, textX: 200, textY: 330, gate: 'Gate C', path: 'M 200,350 L 200,310' },
  '108': { cx: 130, cy: 290, textX: 120, textY: 310, gate: 'Gate C', path: 'M 200,350 Q 150,345 130,290' },
  '109': { cx: 80, cy: 250, textX: 60, textY: 260, gate: 'Gate D', path: 'M 50,200 Q 55,240 80,250' },
  '110': { cx: 60, cy: 200, textX: 40, textY: 205, gate: 'Gate D', path: 'M 50,200 L 60,200' },
  '111': { cx: 80, cy: 150, textX: 60, textY: 145, gate: 'Gate D', path: 'M 50,200 Q 55,160 80,150' },
  '112': { cx: 130, cy: 110, textX: 120, textY: 95, gate: 'Gate A', path: 'M 200,50 Q 150,55 130,110' },
};

export default function WayfinderMap({ stadium, prefilledSection, gate: _gate }: WayfinderMapProps) {
  const [sectionQuery, setSectionQuery] = useState(prefilledSection);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedConcession, setSelectedConcession] = useState<string | null>(null);
  const [useAccessibility, setUseAccessibility] = useState(false);
  const [directionPath, setDirectionPath] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Synchronize with ticket loaded
  useEffect(() => {
    if (prefilledSection) {
      setSectionQuery(prefilledSection);
      handleSearch(prefilledSection);
    }
  }, [prefilledSection]);

  const handleSearch = (sec: string) => {
    const cleanSec = sec.trim();
    if (SECTION_COORDS[cleanSec]) {
      setSelectedSection(cleanSec);
      setSelectedConcession(null);
      setDirectionPath(SECTION_COORDS[cleanSec].path);
    } else {
      alert('Section not found. Try sections 101 to 112.');
    }
  };

  const handleSelectConcession = (con: Concession) => {
    setSelectedConcession(con.id);
    setSelectedSection(null);
    if (SECTION_COORDS[con.section]) {
      setDirectionPath(SECTION_COORDS[con.section].path);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      {/* Left Column: Navigation Settings & Search */}
      <div className="md:col-span-5 flex flex-col gap-5">
        <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)] glow-blue">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Route className="text-[#3B82F6]" size={20} />
            Smart Wayfinder
          </h3>

          {/* Section Search */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-[#9CA3AF]" size={18} />
              <input
                type="text"
                value={sectionQuery}
                onChange={(e) => setSectionQuery(e.target.value)}
                placeholder="Enter Seat Section (e.g. 108)"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 font-medium outline-none focus:border-[#3B82F6]"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(sectionQuery)}
                aria-label="Search Seating Section"
              />
            </div>
            <button
              onClick={() => handleSearch(sectionQuery)}
              className="btn-primary cursor-pointer"
              aria-label="Locate Section button"
            >
              Find Route
            </button>
          </div>

          {/* Accessibility Toggle */}
          <div className="flex items-center justify-between bg-slate-950/45 p-3 rounded-lg border border-[rgba(59,130,246,0.1)]">
            <div className="flex items-center gap-2">
              <Accessibility className="text-[#06B6D4]" size={18} />
              <div>
                <span className="text-sm font-semibold text-white block">Step-Free Navigation</span>
                <span className="text-[10px] text-[#9CA3AF]">Avoid stairs & locate elevators</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={useAccessibility} 
                onChange={(e) => setUseAccessibility(e.target.checked)} 
                className="sr-only peer"
                aria-label="Toggle step-free navigation"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-5 after:width-5 after:transition-all peer-checked:bg-[#06B6D4]"></div>
            </label>
          </div>

          {/* Directions Breakdown */}
          {selectedSection && (
            <div className="mt-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[#3B82F6]">Recommended Gate:</span>
                <span className="badge badge-gold font-bold">{SECTION_COORDS[selectedSection].gate}</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                {useAccessibility 
                  ? `♿ Proceed to ${SECTION_COORDS[selectedSection].gate} accessible check-in. Take Elevator Bank B behind Section 106 up to the concourse. High-capacity, step-free access is active.`
                  : `🚶 Proceed via gate lanes at ${SECTION_COORDS[selectedSection].gate}. Head up the central ramp and bear right past Concession 109 to reach Section ${selectedSection}.`}
              </p>
            </div>
          )}
        </div>

        {/* Live Concessions tracker */}
        <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)]">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="text-[#10B981]" size={20} />
            Live Queue Tracker
          </h3>
          <div className="flex flex-col gap-3">
            {CONCESSIONS.map((con) => (
              <div
                key={con.id}
                onClick={() => handleSelectConcession(con)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                  selectedConcession === con.id
                    ? 'bg-[#10B981]/10 border-[#10B981] glow-green'
                    : 'bg-slate-950/20 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{con.name}</span>
                    <span className="text-[10px] text-[#9CA3AF]">Sec {con.section}</span>
                  </div>
                  <span className="text-xs text-[#9CA3AF] block mb-1">{con.type}</span>
                  <div className="flex gap-1">
                    {con.tags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-[#06B6D4] border border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold block ${
                    con.waitTime > 10 ? 'text-[#EF4444]' : con.waitTime > 5 ? 'text-[#F5A623]' : 'text-[#10B981]'
                  }`}>
                    {con.waitTime} min
                  </span>
                  <span className="text-[9px] text-[#9CA3AF]">wait time</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Interactive SVG Map Display */}
      <div className="md:col-span-7 flex flex-col">
        <div className="glass-container p-6 flex-1 flex flex-col justify-center items-center relative border border-[rgba(59,130,246,0.15)] min-h-[400px]">
          <span className="text-xs text-[#9CA3AF] absolute top-4 left-4 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Interactive Stadium Guide • {stadium}
          </span>

          {/* SVG Map */}
          <div className="w-full relative mt-6 flex justify-center">
            <svg viewBox="0 0 400 400" className="stadium-svg max-w-[360px] md:max-w-[400px]">
              {/* Outer boundary */}
              <circle cx="200" cy="200" r="170" fill="none" stroke="#1E293B" strokeWidth="4" />
              
              {/* Seating Sections (101 to 112) */}
              {Object.keys(SECTION_COORDS).map((secKey) => {
                const sec = SECTION_COORDS[secKey];
                const isActive = selectedSection === secKey || (selectedConcession && CONCESSIONS.find(c => c.id === selectedConcession)?.section === secKey);
                const isHovered = hoveredSection === secKey;
                const isCongested = secKey === '109'; // Simulate concession congestion

                return (
                  <g 
                    key={secKey}
                    onMouseEnter={() => setHoveredSection(secKey)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => {
                      setSelectedSection(secKey);
                      setSelectedConcession(null);
                      setDirectionPath(sec.path);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={sec.cx}
                      cy={sec.cy}
                      r="22"
                      className={`stadium-section ${isActive ? 'active' : ''} ${isCongested ? 'congested' : ''}`}
                      style={{
                        fill: isActive ? '#3B82F6' : isCongested ? 'rgba(239, 68, 68, 0.4)' : isHovered ? 'rgba(59,130,246,0.2)' : '#111827',
                        stroke: isActive ? '#60A5FA' : isCongested ? '#EF4444' : '#1E293B',
                        strokeWidth: isActive || isHovered ? '2px' : '1px',
                        transition: 'all 0.2s ease'
                      }}
                    />
                    <text
                      x={sec.textX}
                      y={sec.textY}
                      fill={isActive ? '#FFFFFF' : '#9CA3AF'}
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
              <rect x="140" y="150" width="120" height="100" rx="6" fill="#047857" stroke="#059669" strokeWidth="2" opacity="0.6" />
              <line x1="200" y1="150" x2="200" y2="250" stroke="#a7f3d0" strokeWidth="1" strokeDasharray="2" opacity="0.7" />
              <circle cx="200" cy="200" r="20" fill="none" stroke="#a7f3d0" strokeWidth="1.5" opacity="0.7" />

              {/* Gates markers (Entry Gates) */}
              {/* Gate A (North) */}
              <circle cx="200" cy="50" r="8" className="stadium-gate" />
              <text x="200" y="40" fill="#F5A623" fontSize="8" fontWeight="bold" textAnchor="middle">GATE A</text>

              {/* Gate B (East) */}
              <circle cx="350" cy="200" r="8" className="stadium-gate" />
              <text x="375" y="203" fill="#F5A623" fontSize="8" fontWeight="bold" textAnchor="middle">GATE B</text>

              {/* Gate C (South) */}
              <circle cx="200" cy="350" r="8" className="stadium-gate" />
              <text x="200" y="367" fill="#F5A623" fontSize="8" fontWeight="bold" textAnchor="middle">GATE C</text>

              {/* Gate D (West) */}
              <circle cx="50" cy="200" r="8" className="stadium-gate" />
              <text x="25" y="203" fill="#F5A623" fontSize="8" fontWeight="bold" textAnchor="middle">GATE D</text>

              {/* Concession Stand Icons (Stars) */}
              {CONCESSIONS.map((con) => {
                const sec = SECTION_COORDS[con.section];
                if (!sec) return null;
                const isConActive = selectedConcession === con.id;
                return (
                  <g key={`star-${con.id}`} className="cursor-pointer" onClick={() => handleSelectConcession(con)}>
                    <polygon
                      points={`${sec.cx},${sec.cy-8} ${sec.cx+2.5},${sec.cy-2.5} ${sec.cx+8},${sec.cy-2} ${sec.cx+3.5},${sec.cy+2} ${sec.cx+5},${sec.cy+7.5} ${sec.cx},${sec.cy+4.5} ${sec.cx-5},${sec.cy+7.5} ${sec.cx-3.5},${sec.cy+2} ${sec.cx-8},${sec.cy-2} ${sec.cx-2.5},${sec.cy-2.5}`}
                      fill={isConActive ? '#10B981' : '#F59E0B'}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                    />
                  </g>
                );
              })}

              {/* Render dynamic pathing line (Glowing Route) */}
              {directionPath && (
                <path
                  d={directionPath}
                  fill="none"
                  stroke={useAccessibility ? '#06B6D4' : '#3B82F6'}
                  strokeWidth="3.5"
                  strokeDasharray="6 3"
                  className="animate-[dash_2s_linear_infinite]"
                  style={{
                    filter: useAccessibility ? 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))' : 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))'
                  }}
                />
              )}
            </svg>

            {/* Custom SVG Pathing animation */}
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -20;
                }
              }
            `}</style>
          </div>

          {/* Map legend */}
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-[#9CA3AF] border-t border-slate-800 pt-4 w-full justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800 inline-block"></span>
              <span>Sections</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#F5A623] inline-block"></span>
              <span>Entry Gates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 10 10" className="inline-block">
                <polygon points="5,0 6,2.5 9,2.5 7,4 8,6.5 5,5 2,6.5 3,4 1,2.5 4,2.5" fill="#F59E0B" />
              </svg>
              <span className="ml-1">Concessions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 border-t-2 border-dashed border-[#3B82F6] inline-block"></span>
              <span>Active Route</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
