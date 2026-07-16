import { useState } from 'react';
import { Users, UserCheck, ShieldCheck, Sparkles, Send } from 'lucide-react';
import type { Incident, Volunteer } from '../utils/stadiumLogic';

interface TaskDispatcherProps {
  volunteers: Volunteer[];
  incidents: Incident[];
  onAssign: (vId: string, location: string) => void;
}

export default function TaskDispatcher({ volunteers, incidents, onAssign }: TaskDispatcherProps) {
  const [selectedIncId, setSelectedIncId] = useState<string>('');
  const [selectedVolId, setSelectedVolId] = useState<string>('');
  const [assignmentLog, setAssignmentLog] = useState<string[]>([]);

  const activeIncidents = incidents.filter(inc => inc.status !== 'resolved');

  // Compute GenAI Dispatch recommendation
  const getDispatchRecommendation = () => {
    if (activeIncidents.length === 0) {
      return { text: "All systems clear. No active dispatches required.", volId: '', incId: '' };
    }

    const targetInc = activeIncidents[0]; // Recommend for the oldest/highest priority incident
    
    // Look for idle volunteer with matching skill
    let matchedVol = volunteers.find(v => v.status === 'idle' && v.skills.includes('Crowd Control'));
    
    if (targetInc.category === 'Facility Accessibility') {
      matchedVol = volunteers.find(v => v.status === 'idle' && v.skills.includes('Wheelchair Assist')) || matchedVol;
    } else if (targetInc.category === 'Lost & Found') {
      matchedVol = volunteers.find(v => v.status === 'idle' && v.skills.includes('Multilingual')) || matchedVol;
    }

    // Default fallback to any idle volunteer
    if (!matchedVol) {
      matchedVol = volunteers.find(v => v.status === 'idle');
    }

    if (!matchedVol) {
      return { text: "⚠️ ALL VOLUNTEERS BUSY: Please request staff backup or wait until current assignments complete.", volId: '', incId: '' };
    }

    return {
      text: `💡 AI Dispatch Suggestion: Dispatch ${matchedVol.name} to ${targetInc.location} for '${targetInc.title}'. Reason: ${matchedVol.name} has [${matchedVol.skills.join(', ')}] skills, is currently idle, and stationed nearby at ${matchedVol.location}.`,
      volId: matchedVol.id,
      incId: targetInc.id
    };
  };

  const recommendation = getDispatchRecommendation();

  const handleAssign = (vId: string, incId: string) => {
    const vol = volunteers.find(v => v.id === vId);
    const inc = incidents.find(i => i.id === incId);

    if (vol && inc) {
      onAssign(vId, inc.location);
      const log = `Dispatched ${vol.name} (${vol.role}) to ${inc.location} to handle: "${inc.title}"`;
      setAssignmentLog(prev => [log, ...prev]);
      
      // Clear selections
      setSelectedIncId('');
      setSelectedVolId('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      {/* Left Column: Staff & Volunteers list */}
      <div className="md:col-span-6 flex flex-col gap-5">
        <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)] glow-blue">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="text-[#3B82F6]" size={20} />
            Active Volunteers & Marshals
          </h3>

          <div className="flex flex-col gap-3">
            {volunteers.map((vol) => (
              <div
                key={vol.id}
                role="button"
                tabIndex={vol.status === 'idle' ? 0 : -1}
                onClick={() => vol.status === 'idle' && setSelectedVolId(vol.id)}
                onKeyDown={(e) => {
                  if (vol.status === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setSelectedVolId(vol.id);
                  }
                }}
                className={`p-3 rounded-lg border transition-all flex justify-between items-center focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] ${
                  vol.status === 'busy' ? 'opacity-50 border-slate-900 bg-slate-950/20'
                    : selectedVolId === vol.id ? 'bg-[#3B82F6]/15 border-[#3B82F6] glow-blue'
                    : 'bg-slate-950/10 border-slate-800 hover:border-slate-700 cursor-pointer'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{vol.name}</span>
                    <span className="text-[10px] text-[#9CA3AF] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">{vol.role}</span>
                  </div>
                  <span className="text-xs text-[#9CA3AF] block mt-0.5">📍 Location: {vol.location}</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {vol.skills.map((skill, idx) => (
                      <span key={idx} className="text-[9px] px-1 bg-slate-900 text-[#06B6D4] border border-slate-800 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    vol.status === 'busy' ? 'badge-gold' : 'badge-green'
                  }`}>
                    {vol.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Dispatch Panel & Smart Recommendations */}
      <div className="md:col-span-6 flex flex-col gap-5">
        {/* Recommendation Engine Banner */}
        <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)] bg-slate-950/40">
          <h3 className="text-xs font-bold text-[#F5A623] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles size={14} className="animate-pulse" />
            GenAI Dispatch Recommendation Engine
          </h3>
          <div className="p-3 bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.15)] rounded-lg text-xs leading-relaxed text-[#F3F4F6]">
            {recommendation.text}
          </div>
          {recommendation.volId && recommendation.incId && (
            <div className="flex justify-end mt-3">
              <button
                onClick={() => handleAssign(recommendation.volId, recommendation.incId)}
                className="px-4 py-2 rounded-lg bg-[#F5A623] hover:bg-[#d97706] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                aria-label="Apply AI Dispatch Recommendation"
              >
                <UserCheck size={13} />
                Apply AI Dispatch
              </button>
            </div>
          )}
        </div>

        {/* Manual dispatcher control */}
        <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)]">
          <h3 className="text-sm font-semibold text-white mb-3">Manual Dispatch Override</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] text-[#9CA3AF] block font-semibold mb-1">Select Incident</label>
              <select
                value={selectedIncId}
                onChange={(e) => setSelectedIncId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white outline-none cursor-pointer"
                aria-label="Select Incident"
              >
                <option value="">-- Choose Active Incident --</option>
                {activeIncidents.map(inc => (
                  <option key={inc.id} value={inc.id}>{inc.title} ({inc.location})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#9CA3AF] block font-semibold mb-1">Select Volunteer</label>
              <select
                value={selectedVolId}
                onChange={(e) => setSelectedVolId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white outline-none cursor-pointer"
                aria-label="Select Volunteer"
              >
                <option value="">-- Choose Idle Volunteer --</option>
                {volunteers.filter(v => v.status === 'idle').map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.role}) - currently at {v.location}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleAssign(selectedVolId, selectedIncId)}
              disabled={!selectedIncId || !selectedVolId}
              className="btn-primary w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              aria-label="Dispatch Staff button"
            >
              <Send size={13} />
              Dispatch Staff
            </button>
          </div>
        </div>

        {/* Live operational log list */}
        {assignmentLog.length > 0 && (
          <div className="glass-container p-5 border border-[rgba(59,130,246,0.15)]">
            <h3 className="text-xs font-bold text-[#10B981] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Operations Dispatch Log
            </h3>
            <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
              {assignmentLog.map((log, idx) => (
                <div key={idx} className="text-xs text-[#9CA3AF] bg-slate-950/40 p-2.5 rounded border border-slate-900 flex items-start gap-1.5">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <p>{log}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
