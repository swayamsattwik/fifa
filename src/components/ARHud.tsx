import { useState } from 'react';
import { Camera, Navigation, MapPin, Compass, AlertCircle } from 'lucide-react';

interface ARHudProps {
  stadium: string;
  gate: string;
}

export default function ARHud({ stadium, gate: _gate }: ARHudProps) {
  const [hudTarget, setHudTarget] = useState<'gate' | 'restroom' | 'tacos'>('gate');

  return (
    <div className="glass-container p-6 border border-[rgba(59,130,246,0.15)] glow-blue flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Camera className="text-[#06B6D4]" size={20} />
            Smart AR HUD Simulator
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Point your camera at stadium signs for real-time AI overlays and navigation guidance.
          </p>
        </div>
        
        {/* Toggle Target Destination */}
        <div className="flex gap-2">
          <button
            onClick={() => setHudTarget('gate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              hudTarget === 'gate'
                ? 'bg-[#06B6D4]/10 border-[#06B6D4] text-[#06B6D4]'
                : 'bg-slate-800 border-slate-700 text-[#9CA3AF] hover:text-white'
            }`}
            aria-label="Direct to Gate C"
          >
            Direct to Gate C
          </button>
          <button
            onClick={() => setHudTarget('restroom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              hudTarget === 'restroom'
                ? 'bg-[#06B6D4]/10 border-[#06B6D4] text-[#06B6D4]'
                : 'bg-slate-800 border-slate-700 text-[#9CA3AF] hover:text-white'
            }`}
            aria-label="Direct to Restroom"
          >
            Restroom (Sec 108)
          </button>
          <button
            onClick={() => setHudTarget('tacos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              hudTarget === 'tacos'
                ? 'bg-[#06B6D4]/10 border-[#06B6D4] text-[#06B6D4]'
                : 'bg-slate-800 border-slate-700 text-[#9CA3AF] hover:text-white'
            }`}
            aria-label="Direct to Kickoff Tacos"
          >
            Kickoff Tacos
          </button>
        </div>
      </div>

      {/* Simulated camera feed viewport */}
      <div 
        className="ar-simulator relative border-2 border-slate-800 shadow-inner"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(6, 10, 19, 0.4), rgba(6, 10, 19, 0.8)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '420px'
        }}
      >
        {/* AR Scan Line animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#06B6D4] opacity-50 animate-[scanLine_4s_linear_infinite]"></div>

        {/* HUD Elements Overlay */}
        <div className="ar-overlay">
          {/* Top Panel: Compass & Info */}
          <div className="flex justify-between items-start pointer-events-auto">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-xs flex items-center gap-3">
              <Compass className="text-[#3B82F6] animate-[spin_20s_linear_infinite]" size={20} />
              <div>
                <span className="font-bold text-white block">Heading North-East</span>
                <span className="text-[#9CA3AF]">{stadium} Concourse A</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="text-[#F5A623] animate-pulse" size={16} />
              <div>
                <span className="font-bold text-white block">Crowd Level: Moderate</span>
                <span className="text-[#9CA3AF]">Gate check-in running normally</span>
              </div>
            </div>
          </div>

          {/* Center: Dynamic Wayfinder Anchors based on target */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {hudTarget === 'gate' && (
              <div 
                className="ar-marker pointer-events-auto"
                style={{ top: '40%', left: '42%' }}
              >
                <MapPin size={14} className="text-[#06B6D4]" />
                <div>
                  <span className="font-bold block">Gate C Entrance</span>
                  <span>120 meters • Walk straight</span>
                </div>
              </div>
            )}

            {hudTarget === 'restroom' && (
              <div 
                className="ar-marker pointer-events-auto"
                style={{ top: '35%', left: '20%', borderColor: '#10B981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
              >
                <MapPin size={14} className="text-[#10B981]" />
                <div>
                  <span className="font-bold block">Restrooms (Sec 108)</span>
                  <span>45 meters • Turn left at ramp</span>
                </div>
              </div>
            )}

            {hudTarget === 'tacos' && (
              <div 
                className="ar-marker pointer-events-auto"
                style={{ top: '45%', left: '60%', borderColor: '#F5A623', boxShadow: '0 0 10px rgba(245, 166, 35, 0.5)' }}
              >
                <MapPin size={14} className="text-[#F5A623]" />
                <div>
                  <span className="font-bold block">Kickoff Tacos (Sec 112)</span>
                  <span>75 meters • Turn right</span>
                </div>
              </div>
            )}

            {/* Simulated 3D Guidance Arrow */}
            <div className="absolute bottom-16 flex flex-col items-center">
              <div className="animate-bounce mb-1">
                <Navigation 
                  className={`w-12 h-12 ${
                    hudTarget === 'gate' ? 'text-[#06B6D4]' : hudTarget === 'restroom' ? 'text-[#10B981] -rotate-45' : 'text-[#F5A623] rotate-45'
                  }`}
                  style={{ filter: 'drop-shadow(0 0 10px currentColor)', transition: 'transform 0.5s ease' }} 
                />
              </div>
              <span className="text-xs font-bold text-white bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800">
                {hudTarget === 'gate' && 'Proceed Straight towards Gate C'}
                {hudTarget === 'restroom' && 'Bear Left towards Section 108 Ramps'}
                {hudTarget === 'tacos' && 'Bear Right past Section 112 Concourse'}
              </span>
            </div>
          </div>

          {/* Bottom Panel: Pitch View Simulator Tag */}
          <div className="flex justify-center w-full pointer-events-auto mt-auto">
            <span className="text-[10px] text-[#9CA3AF] bg-slate-950/80 px-4 py-1 rounded-full border border-slate-800/80">
              Camera simulated view • Press targets to toggle direction path overlays.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
