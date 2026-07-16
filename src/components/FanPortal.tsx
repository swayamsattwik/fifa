import { useState } from 'react';
import AIAssistant from './AIAssistant';
import WayfinderMap from './WayfinderMap';
import ARHud from './ARHud';
import TransitHub from './TransitHub';
import { Compass, MessageSquare, MapPin, Bus, Smartphone } from 'lucide-react';

interface FanPortalProps {
  stadium: string;
  onConcessionStatusChange?: (id: string, waitTime: number) => void;
}

export default function FanPortal({ stadium }: FanPortalProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'map' | 'ar' | 'transit'>('ai');
  const [scannedTicket, setScannedTicket] = useState<{
    section: string;
    row: string;
    seat: string;
    gate: string;
    transitType: string;
  } | null>(null);

  // Callback to share scanned ticket details with the map and assistant
  const handleTicketScan = (ticketData: any) => {
    setScannedTicket(ticketData);
    setActiveTab('map'); // Switch to map automatically to show routes
  };

  return (
    <div className="w-full">
      {/* Sub-navigation Tabs */}
      <div className="flex justify-center border-b border-[rgba(59,130,246,0.15)] mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'ai'
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
          aria-label="Ask GenAI Assistant"
        >
          <MessageSquare size={18} />
          GenAI Assistant
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'map'
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
          aria-label="Stadium Map and Seating"
        >
          <MapPin size={18} />
          Wayfinder & Concessions
        </button>
        <button
          onClick={() => setActiveTab('ar')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'ar'
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
          aria-label="Augmented Reality HUD Simulator"
        >
          <Compass size={18} />
          AR Wayfinder HUD
        </button>
        <button
          onClick={() => setActiveTab('transit')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'transit'
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
          aria-label="Transit and Ticketing"
        >
          <Bus size={18} />
          Transit & Tickets
        </button>
      </div>

      {/* Scanned ticket banner alert */}
      {scannedTicket && (
        <div className="mx-auto max-w-4xl mb-6 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] rounded-lg p-3 flex justify-between items-center text-sm glow-green">
          <div className="flex items-center gap-2">
            <Smartphone className="text-[#10B981]" size={16} />
            <span>
              <strong>Ticket Loaded:</strong> Section {scannedTicket.section}, Row {scannedTicket.row}, Seat {scannedTicket.seat}. Enter via <strong>{scannedTicket.gate}</strong>.
            </span>
          </div>
          <button 
            onClick={() => setScannedTicket(null)}
            className="text-[#9CA3AF] hover:text-[#F3F4F6] font-semibold cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Tab Contents */}
      <div className="mx-auto max-w-5xl">
        {activeTab === 'ai' && (
          <AIAssistant stadium={stadium} scannedTicket={scannedTicket} />
        )}
        {activeTab === 'map' && (
          <WayfinderMap 
            stadium={stadium} 
            prefilledSection={scannedTicket?.section || ''} 
            gate={scannedTicket?.gate || ''}
          />
        )}
        {activeTab === 'ar' && (
          <ARHud stadium={stadium} gate={scannedTicket?.gate || 'Gate B'} />
        )}
        {activeTab === 'transit' && (
          <TransitHub onTicketScan={handleTicketScan} />
        )}
      </div>
    </div>
  );
}
