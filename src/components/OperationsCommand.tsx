import { useState } from 'react';
import IncidentManagement from './IncidentManagement';
import CrowdHeatmap from './CrowdHeatmap';
import TaskDispatcher from './TaskDispatcher';
import SustainabilityHub from './SustainabilityHub';
import { AlertOctagon, Users, ShieldAlert, Leaf, Settings } from 'lucide-react';
import type { Incident, Volunteer } from '../utils/stadiumLogic';

export default function OperationsCommand() {
  const [activeTab, setActiveTab] = useState<'incidents' | 'crowd' | 'tasks' | 'sustainability'>('incidents');
  const [simulationScenario, setSimulationScenario] = useState<string>('Normal');

  // Shared active operational incidents state
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'inc-1',
      title: 'Crowd congestion at Gate B Turnstiles',
      location: 'Gate B Entrance',
      severity: 'high',
      time: '12 mins ago',
      status: 'active',
      category: 'Crowd Flow'
    },
    {
      id: 'inc-2',
      title: 'Elevator 3 structural error (halted)',
      location: 'Elevator Bank A (North)',
      severity: 'medium',
      time: '24 mins ago',
      status: 'active',
      category: 'Facility Accessibility'
    },
    {
      id: 'inc-3',
      title: 'Lost child near Concession Stand 3',
      location: 'Concourse Section 115',
      severity: 'low',
      time: '6 mins ago',
      status: 'active',
      category: 'Lost & Found'
    }
  ]);

  // Shared volunteer workers state
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: 'v-1', name: 'John Doe', role: 'Security Marshal', location: 'Gate B', status: 'busy', skills: ['Crowd Control', 'First Aid'] },
    { id: 'v-2', name: 'Marta Gomez', role: 'Accessibility Lead', location: 'Gate A', status: 'idle', skills: ['Wheelchair Assist', 'Spanish Translator'] },
    { id: 'v-3', name: 'Yuki Sato', role: 'Guest Ambassador', location: 'Section 108', status: 'idle', skills: ['Multilingual', 'Info Desk'] },
    { id: 'v-4', name: 'David Smith', role: 'First Aid Volunteer', location: 'Section 115', status: 'idle', skills: ['Paramedic', 'CPR'] },
    { id: 'v-5', name: 'Alice Chen', role: 'Facility Crew', location: 'Gate C', status: 'busy', skills: ['Maintenance', 'Elevator Mechanics'] }
  ]);

  // Handler to resolve incidents
  const resolveIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'resolved' } : inc));
  };

  // Handler to assign a volunteer to a task
  const assignVolunteer = (vId: string, location: string) => {
    setVolunteers(prev => prev.map(v => v.id === vId ? { ...v, status: 'busy', location } : v));
  };

  // Handler to simulate operational scenarios
  const triggerScenario = (scenario: string) => {
    setSimulationScenario(scenario);
    if (scenario === 'Heavy Rain') {
      // Add heavy rain weather alert and crowd incident
      const newInc: Incident = {
        id: `inc-${Date.now()}`,
        title: 'Heavy rain causing congestion at uncovered shuttle bays',
        location: 'Zone 2 Shuttle Terminals',
        severity: 'high',
        time: 'Just now',
        status: 'active',
        category: 'Transit Weather'
      };
      setIncidents(prev => [newInc, ...prev]);
    } else if (scenario === 'Gate B Blockage') {
      // Close Gate B turnstiles
      const newInc: Incident = {
        id: `inc-${Date.now()}`,
        title: 'Gate B ticket-scanners technical crash (shutting gate)',
        location: 'Gate B Entry Gates',
        severity: 'critical',
        time: 'Just now',
        status: 'active',
        category: 'Security Infrastructure'
      };
      setIncidents(prev => [newInc, ...prev]);
    }
  };

  return (
    <div className="w-full">
      {/* Simulation Controls Panel (High impact capability demo) */}
      <div className="mx-auto max-w-5xl mb-6 bg-slate-950/60 border border-[rgba(59,130,246,0.15)] rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Settings className="text-[#F5A623] animate-spin" style={{ animationDuration: '6s' }} size={18} />
          <div>
            <span className="text-xs text-[#9CA3AF] block font-semibold uppercase tracking-wider">Active Incident Simulator</span>
            <span className="text-sm font-bold text-white">Current Scenario: <span className="text-[#3B82F6]">{simulationScenario}</span></span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => triggerScenario('Heavy Rain')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 hover:border-[#3B82F6] cursor-pointer transition-all"
            aria-label="Simulate Heavy Rain"
          >
            🌧️ Rain Incident
          </button>
          <button
            onClick={() => triggerScenario('Gate B Blockage')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 hover:border-[#EF4444] cursor-pointer transition-all"
            aria-label="Simulate Gate B Blockage"
          >
            🚫 Block Gate B
          </button>
          <button
            onClick={() => {
              setSimulationScenario('Normal');
              setIncidents([
                { id: 'inc-1', title: 'Crowd congestion at Gate B Turnstiles', location: 'Gate B Entrance', severity: 'high', time: '12 mins ago', status: 'active', category: 'Crowd Flow' },
                { id: 'inc-2', title: 'Elevator 3 structural error (halted)', location: 'Elevator Bank A (North)', severity: 'medium', time: '24 mins ago', status: 'active', category: 'Facility Accessibility' }
              ]);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs text-[#9CA3AF] border border-slate-800 hover:text-white cursor-pointer transition-all"
            aria-label="Reset simulation to default"
          >
            Reset Simulation
          </button>
        </div>
      </div>

      {/* Operations Navigation Tab Bar */}
      <div className="flex justify-center border-b border-[rgba(59,130,246,0.15)] mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'incidents'
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
          aria-label="Active Incidents list"
        >
          <ShieldAlert size={18} />
          Active Incidents ({incidents.filter(i => i.status !== 'resolved').length})
        </button>
        <button
          onClick={() => setActiveTab('crowd')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'crowd'
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
          aria-label="Crowd flow heatmap and analysis"
        >
          <AlertOctagon size={18} />
          Crowd Heatmap
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'tasks'
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
          aria-label="Volunteer task dispatcher"
        >
          <Users size={18} />
          Volunteer dispatcher
        </button>
        <button
          onClick={() => setActiveTab('sustainability')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'sustainability'
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
          aria-label="Sustainability metrics tracker"
        >
          <Leaf size={18} />
          Sustainability
        </button>
      </div>

      {/* Operations Panel Contents */}
      <div className="mx-auto max-w-5xl">
        {activeTab === 'incidents' && (
          <IncidentManagement 
            incidents={incidents} 
            volunteers={volunteers}
            onResolve={resolveIncident} 
            onUpdateIncidents={setIncidents}
          />
        )}
        {activeTab === 'crowd' && (
          <CrowdHeatmap scenario={simulationScenario} />
        )}
        {activeTab === 'tasks' && (
          <TaskDispatcher 
            volunteers={volunteers} 
            incidents={incidents}
            onAssign={assignVolunteer}
          />
        )}
        {activeTab === 'sustainability' && (
          <SustainabilityHub />
        )}
      </div>
    </div>
  );
}
