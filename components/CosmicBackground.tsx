'use client';

import React from 'react';
import PlanetBackdrop, { PlanetSpec } from './PlanetBackdrop';

const backgroundStars = Array.from({ length: 72 }, (_, i) => ({
  id: i,
  top: `${(i * 17) % 100}%`,
  left: `${(i * 29) % 100}%`,
  size: (i % 3) + 1,
  duration: `${2.4 + (i % 4) * 0.7}s`,
  delay: `${(i % 6) * 0.35}s`,
}));

const shootingStars = [
  { id: 1, top: '12%', left: '72%', duration: '7s', delay: '0.8s' },
  { id: 2, top: '28%', left: '84%', duration: '8s', delay: '3.2s' },
  { id: 3, top: '44%', left: '64%', duration: '6.5s', delay: '5.4s' },
];

interface CosmicBackgroundProps {
  planets?: PlanetSpec[];
  masked?: boolean;
}

const CosmicBackground = ({ planets = [], masked = false }: CosmicBackgroundProps) => {
  return (
    <>
      {planets.length > 0 ? <PlanetBackdrop planets={planets} /> : null}

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={
          masked
            ? {
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 14%, rgba(0,0,0,1) 100%)',
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 14%, rgba(0,0,0,1) 100%)',
              }
            : undefined
        }
      >
        {backgroundStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: 0.16,
              animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
            }}
          />
        ))}

        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className="absolute z-0"
            style={{
              top: star.top,
              left: star.left,
              width: '120px',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
              opacity: 0,
              animation: `shooting-star ${star.duration} linear ${star.delay} infinite`,
            }}
          >
            <div className="absolute right-0 top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.9)]" />
          </div>
        ))}

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; transform: scale(0.8); }
            50% { opacity: 0.8; transform: scale(1.2); }
          }
          @keyframes shooting-star {
            0% { transform: rotate(215deg) translateX(0); opacity: 1; }
            10% { transform: rotate(215deg) translateX(800px); opacity: 0; }
            100% { transform: rotate(215deg) translateX(800px); opacity: 0; }
          }
        `}</style>
      </div>
    </>
  );
};

export default CosmicBackground;
