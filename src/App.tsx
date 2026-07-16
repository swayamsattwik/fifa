import { useState, useEffect } from 'react';
import FanPortal from './components/FanPortal';
import OperationsCommand from './components/OperationsCommand';
import { ShieldCheck, Clock, HelpCircle } from 'lucide-react';

export default function App() {
  const [persona, setPersona] = useState<'fan' | 'operator'>('fan');
  const [stadium, setStadium] = useState<string>('MetLife Stadium (East Rutherford)');
  const [countdown, setCountdown] = useState<string>('02h:14m:45s');
  
  // Real-time countdown simulation
  useEffect(() => {
    let totalSecs = 2 * 3600 + 14 * 60 + 45;
    const timer = setInterval(() => {
      if (totalSecs <= 0) {
        setCountdown('00h:00m:00s');
        clearInterval(timer);
        return;
      }
      totalSecs--;
      const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
      const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
      const s = (totalSecs % 60).toString().padStart(2, '0');
      setCountdown(`${h}h:${m}m:${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner Alert Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 border-b border-[rgba(59,130,246,0.15)] text-center py-2 px-4 text-xs font-semibold flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="text-[#9CA3AF]">
            FIFA World Cup 2026 Smart Hub • All stadium networks operational
          </span>
        </div>
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <span className="text-[#9CA3AF] flex items-center gap-1">
            <Clock size={12} className="text-[#3B82F6]" />
            Kickoff:
          </span>
          <span className="text-white font-bold font-mono tracking-wider bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            {countdown}
          </span>
        </div>
      </div>

      {/* Main Header navigation */}
      <header className="bg-slate-950/85 backdrop-blur-md border-b border-[rgba(59,130,246,0.15)] py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] via-[#06B6D4] to-[#10B981] flex items-center justify-center text-white shadow-lg glow-blue">
              <ShieldCheck size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-white font-heading m-0 leading-none">StadiaFlow AI</h1>
                <span className="text-[10px] bg-gradient-to-r from-[#F5A623] to-[#F97316] text-slate-950 px-2 py-0.5 rounded font-black tracking-wider uppercase leading-none">
                  GenAI
                </span>
              </div>
              <span className="text-xs text-[#9CA3AF] mt-1 block">FIFA World Cup 2026™ Operations Hub</span>
            </div>
          </div>

          {/* Core Selectors: Stadium & Persona */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Stadium Switcher */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs">
              <span className="text-[#9CA3AF] font-semibold">Venue:</span>
              <select
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                className="bg-transparent border-none text-white outline-none font-bold cursor-pointer"
                aria-label="Select Stadium Venue"
              >
                <option value="MetLife Stadium (East Rutherford)" className="bg-slate-900 text-white">MetLife Stadium, NJ</option>
                <option value="SoFi Stadium (Los Angeles)" className="bg-slate-900 text-white">SoFi Stadium, LA</option>
                <option value="Estadio Azteca (Mexico City)" className="bg-slate-900 text-white">Estadio Azteca, CDMX</option>
              </select>
            </div>

            {/* Persona Switcher Buttons */}
            <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setPersona('fan')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  persona === 'fan'
                    ? 'bg-[#3B82F6] text-white shadow-md'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
                aria-label="Switch to Fan Experience Portal"
              >
                Fan Portal
              </button>
              <button
                onClick={() => setPersona('operator')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  persona === 'operator'
                    ? 'bg-[#3B82F6] text-white shadow-md'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
                aria-label="Switch to Operator Command Dashboard"
              >
                Operator Command
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main KPI Status bar */}
      <section className="bg-slate-950/40 border-b border-[rgba(59,130,246,0.1)] py-4 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Live Occupancy</span>
            <span className="text-lg font-extrabold text-white mt-1">74,210 / 82,500</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Gate Check-in wait</span>
            <span className="text-lg font-extrabold text-[#10B981] mt-1">4.2 mins (Avg)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Active Incidents</span>
            <span className="text-lg font-extrabold text-[#EF4444] mt-1">3 Alerts</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Weather Conditions</span>
            <span className="text-lg font-extrabold text-[#06B6D4] mt-1">22°C • Clear Sky</span>
          </div>
        </div>
      </section>

      {/* Primary Content Container */}
      <main className="flex-1 py-8 px-6 max-w-7xl mx-auto w-full">
        {persona === 'fan' ? (
          <div className="flex flex-col gap-6">
            <div className="text-center max-w-2xl mx-auto mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded-full border border-[#3B82F6]/25">
                Fan Hub
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">Elevating Your Matchday Experience</h2>
              <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
                Connect with our GenAI Assistant to easily navigate sections, find the fastest queues, explore concession stands, check transport guides, and scan your tickets.
              </p>
            </div>
            <FanPortal stadium={stadium} />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="text-center max-w-2xl mx-auto mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/25">
                Staff Dashboard
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">Stadium Operations Command Center</h2>
              <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
                Leverage generative intelligence for crowd simulation alerts, incident resolution plans, staff volunteer dispatches, and sustainability metrics coordination.
              </p>
            </div>
            <OperationsCommand />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950/60 border-t border-[rgba(59,130,246,0.15)] py-6 px-6 text-center text-xs text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>StadiaFlow AI © FIFA World Cup 2026™ Demonstration</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white flex items-center gap-1">
              <HelpCircle size={12} />
              Help Support
            </a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Accessibility Standard</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
