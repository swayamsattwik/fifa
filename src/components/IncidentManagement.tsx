import { useState, type Dispatch, type SetStateAction } from 'react';
import { ShieldAlert, Zap, CheckCircle, PlusCircle, Volume2, Sparkles, MessageSquare } from 'lucide-react';
import type { Incident, Volunteer } from '../utils/stadiumLogic';

interface IncidentManagementProps {
  incidents: Incident[];
  volunteers: Volunteer[];
  onResolve: (id: string) => void;
  onUpdateIncidents: Dispatch<SetStateAction<Incident[]>>;
}

// Preset GenAI responses for different incident types
const GENAI_INCIDENT_RESPONSES: Record<string, { thought: string; actionPlan: string[]; broadcastText: string }> = {
  'Crowd Flow': {
    thought: "Gate B sensor reports 87% entrance occupancy. Bottleneck is causing line sprawl of 45 meters. Recommendation: Activate standby ticket-scanning marshals, open side accessibility lanes for general pass-through, and broadcast pedestrian detour routes.",
    actionPlan: [
      "Deploy 2 standby safety stewards to Gate B lane entrances to direct fans to express checkpoints.",
      "Open Gate C (South Side) auxiliary gates to offload 20% of inbound pedestrian traffic.",
      "Update digital street signage within 500 meters to advise incoming fans to detour away from Gate B."
    ],
    broadcastText: "⚠️ WORLD CUP ALERTS: Gate B is currently busy. For faster entry, please head to Gate A (North) or Gate C (South). Gates A & C wait times are under 4 minutes."
  },
  'Facility Accessibility': {
    thought: "Elevator 3 technical halt detected. This impacts step-free access for Sections 104-108. Standard Operating Procedure (SOP) 12: Redirect disabled/wheelchair guests to Elevator 4 (40 meters away) and dispatch safety crews.",
    actionPlan: [
      "Dispatch mechanical crew to reset Elevator 3 breaker control board.",
      "Re-route Marta Gomez (Accessibility Marshal) to Section 106 to escort guests requiring wheelchair support to Elevator 4.",
      "Display temporary elevator detour arrow indicator signals on concourse digital displays."
    ],
    broadcastText: "📢 ACCESSIBILITY ALERTS: Elevator 3 is temporarily out of service. Please use Elevator 4 near Section 109. Accessibility marshals are on site to assist you."
  },
  'Lost & Found': {
    thought: "Missing child reported. Age: 6, wearing official USA team jersey. SOP 9: Lock down immediate sector exits (Sec 114-116), alert all local stewards, check gate camera recordings, and broadcast description discreetly.",
    actionPlan: [
      "Broadcast child description to all active volunteer and staff handheld devices in Zone C.",
      "Station marshal at Exit Gate D to monitor outbound pedestrians.",
      "Coordinate with stadium CCTV operations to run facial detection scan on Sections 112 to 118 cameras."
    ],
    broadcastText: "⚽ INFO DESK: Assistance required in Section 115. Staff are looking for a lost child. If you see a boy wearing a USA jersey, please contact the nearest stadium steward."
  },
  'General': {
    thought: "General operations log received. Scanning parameters against FIFA Matchday safety protocols. Hazard rating low. Containment checklist active.",
    actionPlan: [
      "Notify nearby zone supervisors of the reported condition.",
      "Inspect the location for physical debris or blockages.",
      "Verify safety standards are restored within 15 minutes."
    ],
    broadcastText: "🔔 NOTICE: Stadium staff are addressing an operational item. No action is required from spectators."
  }
};

export default function IncidentManagement({ incidents, volunteers: _volunteers, onResolve, onUpdateIncidents }: IncidentManagementProps) {
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New incident form states
  const [newTitle, setNewTitle] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newSev, setNewSev] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [newCat, setNewCat] = useState('Crowd Flow');

  const triggerGenAIPlan = (id: string, category: string) => {
    // Set status to generating
    onUpdateIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'generating' } : inc));

    setTimeout(() => {
      // Fetch preset response or use fallback
      const response = GENAI_INCIDENT_RESPONSES[category] || GENAI_INCIDENT_RESPONSES['General'];

      onUpdateIncidents(prev => prev.map(inc => inc.id === id ? { 
        ...inc, 
        status: 'active',
        aiResponse: response
      } : inc));

      setActivePlanId(id);
    }, 1200);
  };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLoc.trim()) return;

    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      title: newTitle,
      location: newLoc,
      severity: newSev,
      time: 'Just now',
      status: 'active',
      category: newCat
    };

    onUpdateIncidents(prev => [newInc, ...prev]);
    setNewTitle('');
    setNewLoc('');
    setShowAddForm(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Left Column: Incidents Feed & Logger */}
      <div className="lg:col-span-6 flex flex-col gap-5">
        <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)] glow-blue">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="text-[#EF4444]" size={20} />
              Operations Incident Feed
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-[#3B82F6] hover:text-white flex items-center gap-1 cursor-pointer transition-all"
              aria-label="Log New Incident"
            >
              <PlusCircle size={14} />
              Log Incident
            </button>
          </div>

          {/* Add New Incident Form */}
          {showAddForm && (
            <form onSubmit={handleAddIncident} className="mb-5 p-4 bg-slate-950/50 border border-slate-800 rounded-xl flex flex-col gap-3">
              <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">Log Manual Incident</h4>
              
              <div>
                <label className="text-[10px] text-[#9CA3AF] block font-semibold mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Water leak near Section 104"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-[#3B82F6]"
                  aria-label="Incident Title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#9CA3AF] block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    placeholder="e.g. Section 104 Ramp"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-[#3B82F6]"
                    aria-label="Incident Location"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#9CA3AF] block font-semibold mb-1">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-[#3B82F6] cursor-pointer"
                    aria-label="Incident Category"
                  >
                    <option value="Crowd Flow text">Crowd Flow</option>
                    <option value="Facility Accessibility">Facility Accessibility</option>
                    <option value="Lost & Found">Lost & Found</option>
                    <option value="General">General Safety</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] block font-semibold mb-1">Severity Level</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high', 'critical'].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewSev(sev as any)}
                      className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                        newSev === sev
                          ? sev === 'critical' ? 'bg-[#EF4444] border-[#EF4444] text-white'
                            : sev === 'high' ? 'bg-[#F97316] border-[#F97316] text-white'
                            : sev === 'medium' ? 'bg-[#F5A623] border-[#F5A623] text-white'
                            : 'bg-[#3B82F6] border-[#3B82F6] text-white'
                          : 'bg-slate-900 border-slate-800 text-[#9CA3AF]'
                      }`}
                      aria-label={`Severity ${sev}`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded text-xs bg-transparent text-[#9CA3AF] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-1.5 rounded text-xs cursor-pointer"
                >
                  Create Incident
                </button>
              </div>
            </form>
          )}

          {/* Active Incidents Feed */}
          <div className="flex flex-col gap-4">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className={`border rounded-xl p-4 bg-slate-950/30 transition-all flex flex-col gap-3 ${
                  inc.status === 'resolved'
                    ? 'opacity-40 border-slate-900'
                    : inc.severity === 'critical' ? 'border-[#EF4444]/40 hover:border-[#EF4444]'
                    : inc.severity === 'high' ? 'border-[#F97316]/40 hover:border-[#F97316]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${
                        inc.severity === 'critical' ? 'badge-red'
                          : inc.severity === 'high' ? 'badge-gold'
                          : inc.severity === 'medium' ? 'badge-blue'
                          : 'badge-purple'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">{inc.category} • {inc.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1.5">{inc.title}</h4>
                    <span className="text-xs text-[#9CA3AF] block mt-0.5">📍 {inc.location}</span>
                  </div>
                </div>

                {inc.status !== 'resolved' && (
                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-900 mt-1">
                    <button
                      onClick={() => onResolve(inc.id)}
                      className="px-3 py-1.5 rounded text-xs bg-slate-900 border border-slate-800 text-[#10B981] hover:bg-[#10B981]/10 flex items-center gap-1 cursor-pointer transition-all"
                      aria-label={`Resolve incident ${inc.id}`}
                    >
                      <CheckCircle size={13} />
                      Mark Resolved
                    </button>

                    <button
                      onClick={() => triggerGenAIPlan(inc.id, inc.category)}
                      disabled={inc.status === 'generating'}
                      className="px-3 py-1.5 rounded text-xs bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white flex items-center gap-1 cursor-pointer transition-all glow-blue"
                      aria-label={`GenAI plan for ${inc.id}`}
                    >
                      {inc.status === 'generating' ? (
                        <>
                          <span className="w-3 h-3 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></span>
                          Computing...
                        </>
                      ) : (
                        <>
                          <Zap size={13} />
                          GenAI Response Plan
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: AI Action Plan Generator Panel */}
      <div className="lg:col-span-6 flex flex-col">
        <div className="glass-container p-6 border border-[rgba(59,130,246,0.15)] flex-1 flex flex-col relative min-h-[400px]">
          <span className="text-xs text-[#9CA3AF] absolute top-4 left-4 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5">
            <Sparkles className="text-[#3B82F6]" size={12} />
            GenAI Plan Assistant Panel
          </span>

          {activePlanId ? (
            (() => {
              const activeInc = incidents.find(i => i.id === activePlanId);
              if (!activeInc || !activeInc.aiResponse) {
                return (
                  <div className="flex-1 flex flex-col justify-center items-center text-center mt-6">
                    <p className="text-sm text-[#9CA3AF]">Plan is loading, please wait...</p>
                  </div>
                );
              }
              const plan = activeInc.aiResponse;

              return (
                <div className="mt-8 flex-1 flex flex-col gap-4">
                  <div className="p-3 bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.15)] rounded-lg">
                    <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-1">Target Incident</h4>
                    <span className="text-sm font-semibold text-white block">{activeInc.title}</span>
                    <span className="text-xs text-[#9CA3AF] block mt-0.5">📍 Location: {activeInc.location}</span>
                  </div>

                  {/* Thinking Log */}
                  <div>
                    <h4 className="text-xs font-bold text-[#F5A623] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles size={12} />
                      AI Chain-of-Thought Reasoning
                    </h4>
                    <div className="reasoning-chain max-h-[120px] overflow-y-auto">
                      {plan.thought}
                    </div>
                  </div>

                  {/* Multi-step Containment Actions */}
                  <div>
                    <h4 className="text-xs font-bold text-[#10B981] uppercase tracking-wider mb-2">Recommended Safety Checklist</h4>
                    <div className="flex flex-col gap-2.5">
                      {plan.actionPlan.map((step, idx) => (
                        <div key={idx} className="flex gap-2 text-xs leading-relaxed text-white">
                          <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-900 border border-slate-800 text-[#10B981] font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="flex-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multilingual Broadcast Broadcast Area */}
                  <div className="mt-auto border-t border-slate-900 pt-4">
                    <h4 className="text-xs font-bold text-[#06B6D4] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Volume2 size={13} />
                      PA Public Broadcast Feed (English / Spanish / French)
                    </h4>
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs leading-relaxed text-white italic">
                      {plan.broadcastText}
                    </div>
                    <div className="flex gap-2 justify-end mt-3">
                      <button
                        onClick={() => alert(`Broadcast sent: ${plan.broadcastText}`)}
                        className="px-3.5 py-2 rounded-lg bg-[#06B6D4] hover:bg-[#0891b2] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        aria-label="Broadcast PA Alert"
                      >
                        <MessageSquare size={13} />
                        Broadcast PA Alert
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center mt-6">
              <ShieldAlert className="text-[#3B82F6] mb-3 opacity-60" size={40} />
              <p className="text-sm font-semibold text-white">Select "GenAI Response Plan" on any active incident.</p>
              <p className="text-xs text-[#9CA3AF] max-w-sm mt-1">
                This triggers the GenAI core to construct situational containment maps, routing plans, and PA warnings dynamically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
