import { useState } from 'react';
import { Bus, Train, Car, Scan, Sparkles, CheckCircle2, Ticket } from 'lucide-react';

interface TransitHubProps {
  onTicketScan: (ticketData: {
    section: string;
    row: string;
    seat: string;
    gate: string;
    transitType: string;
    matchName: string;
  }) => void;
}

const MOCK_TICKETS = [
  {
    id: 't1',
    matchName: 'USA vs. Italy - Match 14',
    section: '108',
    row: 'K',
    seat: '12',
    gate: 'Gate C',
    transitType: 'Metro Rail',
  },
  {
    id: 't2',
    matchName: 'Mexico vs. Brazil - Match 18',
    section: '112',
    row: 'D',
    seat: '4',
    gate: 'Gate A',
    transitType: 'Express Shuttle',
  },
  {
    id: 't3',
    matchName: 'Canada vs. Germany - Match 22',
    section: '105',
    row: 'R',
    seat: '21',
    gate: 'Gate B',
    transitType: 'Rideshare Lot E',
  }
];

export default function TransitHub({ onTicketScan }: TransitHubProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedTicketId, setScannedTicketId] = useState<string | null>(null);

  const handleScanTicket = (ticket: typeof MOCK_TICKETS[0]) => {
    setScanning(true);
    setScannedTicketId(ticket.id);
    setTimeout(() => {
      setScanning(false);
      onTicketScan(ticket);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      {/* Left Column: Tickets Scanner */}
      <div className="md:col-span-6 flex flex-col gap-5">
        <div className="glass-container p-6 border border-[rgba(59,130,246,0.15)] glow-blue">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Scan className="text-[#3B82F6]" size={20} />
            Ticket Reader & Assistant
          </h3>
          <p className="text-xs text-[#9CA3AF] mb-5">
            Select a matchday ticket below to simulate scanning your boarding pass. The GenAI assistant will automatically extract seat locations and calculate the best gates and transit options.
          </p>

          <div className="flex flex-col gap-4">
            {MOCK_TICKETS.map((ticket) => (
              <div 
                key={ticket.id}
                className={`border rounded-xl p-4 bg-slate-950/40 relative overflow-hidden transition-all flex flex-col justify-between ${
                  scannedTicketId === ticket.id 
                    ? 'border-[#10B981] bg-[#10B981]/5 glow-green' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#E5A93C] tracking-wider block">FIFA World Cup 2026</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{ticket.matchName}</h4>
                  </div>
                  <Ticket size={20} className="text-[#E5A93C]" />
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2 rounded-lg text-center text-xs border border-slate-800/50 mb-4">
                  <div>
                    <span className="text-[#9CA3AF] block text-[9px]">SECTION</span>
                    <span className="font-bold text-white text-sm">{ticket.section}</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[9px]">ROW</span>
                    <span className="font-bold text-white text-sm">{ticket.row}</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[9px]">SEAT</span>
                    <span className="font-bold text-white text-sm">{ticket.seat}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] text-[#9CA3AF]">Gate: {ticket.gate}</span>
                  <button
                    onClick={() => handleScanTicket(ticket)}
                    disabled={scanning}
                    className={`text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      scannedTicketId === ticket.id
                        ? 'bg-[#10B981] text-slate-950'
                        : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                    }`}
                    aria-label={`Scan ticket ${ticket.id}`}
                  >
                    {scanning && scannedTicketId === ticket.id ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                        Scanning...
                      </>
                    ) : scannedTicketId === ticket.id ? (
                      <>
                        <CheckCircle2 size={13} />
                        Scanned
                      </>
                    ) : (
                      <>
                        <Scan size={13} />
                        Scan Ticket
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Transit Connections & Schedules */}
      <div className="md:col-span-6 flex flex-col gap-5">
        <div className="glass-container p-6 border border-[rgba(59,130,246,0.15)] flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bus className="text-[#10B981]" size={20} />
            Live Transit Scheduler
          </h3>

          <div className="flex flex-col gap-4 flex-1">
            {/* Metro card */}
            <div className="flex justify-between items-start p-4 bg-slate-950/30 border border-slate-800 rounded-xl">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                  <Train size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Stadia SkyRail Express</h4>
                  <span className="text-xs text-[#9CA3AF] block">To Downtown / Airport hubs</span>
                  <span className="text-[10px] text-[#10B981] font-semibold mt-1 inline-block bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/25">
                    Boarding Gate A
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white block">Every 4 min</span>
                <span className="text-[10px] text-[#9CA3AF]">6 min walk</span>
              </div>
            </div>

            {/* Shuttle card */}
            <div className="flex justify-between items-start p-4 bg-slate-950/30 border border-slate-800 rounded-xl">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                  <Bus size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">FIFA Volunteer Shuttle</h4>
                  <span className="text-xs text-[#9CA3AF] block">To Park & Ride lots</span>
                  <span className="text-[10px] text-[#F5A623] font-semibold mt-1 inline-block bg-[#F5A623]/10 px-2 py-0.5 rounded border border-[#F5A623]/25">
                    Departs Zone 2
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white block">Every 8 min</span>
                <span className="text-[10px] text-[#9CA3AF]">4 min walk</span>
              </div>
            </div>

            {/* Rideshare Card */}
            <div className="flex justify-between items-start p-4 bg-slate-950/30 border border-slate-800 rounded-xl">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
                  <Car size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Rideshare Pick-up (Uber/Lyft)</h4>
                  <span className="text-xs text-[#9CA3AF] block">Designated Zone - Lot E</span>
                  <span className="text-[10px] text-[#9CA3AF] mt-1 inline-block bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    High Demand Surcharge Active
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#EF4444] block">16 min wait</span>
                <span className="text-[10px] text-[#9CA3AF]">11 min walk</span>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.15)] rounded-lg p-3 flex gap-2 items-center text-xs">
            <Sparkles className="text-[#3B82F6]" size={16} />
            <span className="text-[#9CA3AF]">
              <strong>AI Recommendation:</strong> Take the <strong>SkyRail Express</strong>. It bypasses external road traffic blockages near Lot E and reaches the main transport hubs 15 minutes faster.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
