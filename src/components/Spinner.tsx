import { useState, useEffect } from 'react';

interface SpinnerProps {
  players: any[];
  spinning: boolean;
  targetIndex: number | null;
  onSpin: () => void;
  disabled: boolean;
}

export default function Spinner({ players, spinning, targetIndex, onSpin, disabled }: SpinnerProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (spinning && targetIndex !== null) {
      // Calculate rotation
      const sliceAngle = 360 / players.length;
      // The pointer is at the top (0 degrees or 360 degrees).
      // If we want targetIndex to land at the top, the wheel needs to rotate such that the target slice is at 0 deg.
      // E.g. Player 0 is at 0 deg, Player 1 is at sliceAngle deg...
      // To bring Player 1 to top, we rotate backward by sliceAngle.
      
      const extraSpins = 5 * 360; // 5 full spins
      const targetRotation = extraSpins + (360 - (targetIndex * sliceAngle));
      
      setRotation(prev => prev + targetRotation);
    }
  }, [spinning, targetIndex, players.length]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-sm mx-auto">
      
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-4xl filter drop-shadow-md">
          👇
        </div>
        
        {/* Wheel */}
        <div 
          className="w-full h-full rounded-full border-8 border-white shadow-2xl relative overflow-hidden transition-transform ease-[cubic-bezier(0.25,0.1,0.15,1)]"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? '3.5s' : '0s',
            // Create a dynamic conic gradient for slices
            background: `conic-gradient(${players.map((p, i) => {
              const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
              const color = colors[i % colors.length];
              const startAngle = i * (360 / players.length);
              const endAngle = (i + 1) * (360 / players.length);
              return `${color} ${startAngle}deg ${endAngle}deg`;
            }).join(', ')})`
          }}
        >
          {players.map((p, i) => {
            const angle = i * (360 / players.length) + (360 / players.length) / 2;
            return (
              <div 
                key={p.id}
                className="absolute w-full h-full flex items-start justify-center origin-center pt-8 md:pt-12 text-white font-bold text-sm md:text-base drop-shadow-md"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div style={{ transform: 'rotate(-90deg)' }} className="truncate max-w-[80px]">
                  {p.name}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-inner z-10 flex items-center justify-center">
           <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <button 
        onClick={onSpin}
        disabled={disabled || spinning}
        className="w-full py-4 rounded-2xl text-white font-bold text-xl bg-[var(--color-brand-coral)] hover:bg-blue-600 shadow-[0_6px_0_#1E3A8A] disabled:opacity-50 disabled:shadow-none hover:translate-y-1 hover:shadow-[0_2px_0_#1E3A8A] transition-all flex justify-center items-center gap-2"
      >
        {spinning ? "Memutar..." : "🎰 Putar Roda"}
      </button>

    </div>
  );
}
