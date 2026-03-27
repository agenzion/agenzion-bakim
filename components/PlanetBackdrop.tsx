'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';

export interface PlanetSpec {
  id: string;
  name: string;
  src: string;
  size: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  opacity?: number;
  blur?: number;
  imageScale?: number;
  duration?: number;
  delay?: number;
  driftX?: string;
  driftY?: string;
  ring?: boolean;
  textureShift?: string;
  textureDuration?: number;
  animateFloat?: boolean;
  animateTexture?: boolean;
}

const PlanetBackdrop = ({ planets }: { planets: PlanetSpec[] }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(backdropRef, {
    amount: 0.2,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile);
    };
  }, []);

  return (
    <div ref={backdropRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {planets.map((planet) => {
        const baseScale = planet.imageScale ?? 1.2;
        const shouldAnimateTexture = planet.animateTexture !== false && !isMobile;
        const texture = (
          <Image
            src={planet.src}
            alt={planet.name}
            fill
            sizes={planet.ring ? '(min-width: 768px) 18rem, 12rem' : '(min-width: 768px) 22rem, 10rem'}
            className="object-cover"
            style={{
              filter: 'brightness(0.82) saturate(0.9) contrast(1.05)',
            }}
            referrerPolicy="no-referrer"
          />
        );

        const planetBody = (
          <div className="absolute inset-0 rounded-full overflow-hidden bg-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            {!shouldAnimateTexture ? (
              <div
                className="absolute inset-[-7%]"
                style={{ transform: `translateX(-2%) scale(${baseScale})` }}
              >
                {texture}
              </div>
            ) : (
              <motion.div
                className="absolute inset-[-7%] will-change-transform"
                initial={{ x: '-2%', scale: baseScale }}
                animate={
                  isInView
                    ? {
                        x: ['-2%', planet.textureShift ?? '2.5%', '-2%'],
                        scale: [baseScale, baseScale * 1.015, baseScale],
                      }
                    : {
                        x: '-2%',
                        scale: baseScale,
                      }
                }
                transition={{
                  duration: isInView ? (planet.textureDuration ?? 36) / 4.785066 : 0.3,
                  repeat: isInView ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: planet.delay ?? 0,
                }}
              >
                {texture}
              </motion.div>
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.03)_28%,rgba(0,0,0,0.22)_64%,rgba(0,0,0,0.45)_100%)]" />
          </div>
        );

        const planetContent = planet.ring ? (
          <div className="relative h-full w-full">
            <div className="absolute left-1/2 top-1/2 h-[28%] w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/14 shadow-[0_0_24px_rgba(255,255,255,0.08)]" />
            <div className="absolute left-1/2 top-1/2 h-[20%] w-[136%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
            <div className="absolute left-1/2 top-1/2 h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2">
              {planetBody}
            </div>
          </div>
        ) : (
          planetBody
        );

        const planetStyle: React.CSSProperties = {
          top: planet.top,
          right: planet.right,
          bottom: planet.bottom,
          left: planet.left,
          width: planet.size,
          height: planet.size,
          opacity: planet.opacity ?? 0.58,
          filter: `blur(${planet.blur ?? 0}px)`,
        };

        if (planet.animateFloat === false) {
          return (
            <div key={planet.id} className="absolute" style={planetStyle}>
              {planetContent}
            </div>
          );
        }

        return (
          <motion.div
            key={planet.id}
            className="absolute"
            style={planetStyle}
            initial={{ x: '0%', y: '0%' }}
            animate={
              isInView
                ? {
                    x: ['0%', planet.driftX ?? '2%', '0%'],
                    y: ['0%', planet.driftY ?? '-2%', '0%'],
                  }
                : {
                    x: '0%',
                    y: '0%',
                  }
            }
            transition={{
              duration: isInView ? planet.duration ?? 24 : 0.3,
              repeat: isInView ? Infinity : 0,
              ease: 'easeInOut',
              delay: planet.delay ?? 0,
            }}
          >
            {planetContent}
          </motion.div>
        );
      })}
    </div>
  );
};

export default PlanetBackdrop;
