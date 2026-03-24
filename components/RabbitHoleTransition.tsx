'use client';

import React, { useEffect, useMemo, type CSSProperties } from 'react';
import { motion } from 'motion/react';

export interface ClickPosition {
  x: number;
  y: number;
}

interface PortalRingProps {
  x: number;
  y: number;
  delay: number;
  peekRadius: number;
  maxRadius: number;
}

interface RabbitHoleTransitionProps {
  children: React.ReactNode;
  clickPos: ClickPosition;
  isOpen: boolean;
}

interface HoleConfig extends ClickPosition {
  delay: number;
  peekRadius: number;
}

type MaskStyle = CSSProperties & {
  '--r-main': string;
};

const PortalRing = ({ x, y, delay, peekRadius, maxRadius }: PortalRingProps) => {
  return (
    <motion.div
      className="pointer-events-none fixed z-[60] flex items-center justify-center"
      style={{ left: x, top: y, x: '-50%', y: '-50%' }}
      initial={{ width: 0, height: 0, opacity: 0, rotate: 0 }}
      animate={{
        width: ['0px', `${peekRadius * 2}px`, `${peekRadius * 2}px`, `${maxRadius * 2}px`],
        height: ['0px', `${peekRadius * 2}px`, `${peekRadius * 2}px`, `${maxRadius * 2}px`],
        opacity: [0, 1, 1, 0],
        rotate: [0, 90, 180, 270],
      }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{
        duration: 1.5,
        times: [0, 0.2, 0.7, 1],
        ease: 'easeInOut',
        delay,
      }}
    >
      <div className="absolute inset-0 rounded-full border-[8px] border-orange-300/40 blur-[8px] shadow-[0_0_15px_5px_rgba(251,146,60,0.4),inset_0_0_10px_2px_rgba(251,146,60,0.3)] mix-blend-screen" />
      <div className="absolute inset-[-15px] rounded-full border-[4px] border-dashed border-orange-400/30 blur-[6px] shadow-[0_0_10px_2px_rgba(245,158,11,0.3)] mix-blend-screen animate-[spin_6s_linear_infinite]" />
      <div className="absolute inset-[15px] rounded-full border-[6px] border-dotted border-orange-500/30 blur-[10px] shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] mix-blend-screen animate-[spin_8s_linear_infinite_reverse]" />
    </motion.div>
  );
};

export function RabbitHoleTransition({
  children,
  clickPos,
  isOpen,
}: RabbitHoleTransitionProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const peekRadius = useMemo(() => {
    const seed =
      Math.abs(Math.round(clickPos.x)) * 31 + Math.abs(Math.round(clickPos.y)) * 17;

    return 120 + (seed % 81);
  }, [clickPos.x, clickPos.y]);

  const hole = useMemo<HoleConfig | null>(() => {
    if (!isOpen) {
      return null;
    }

    return {
      x: clickPos.x,
      y: clickPos.y,
      delay: 0,
      peekRadius,
    };
  }, [clickPos.x, clickPos.y, isOpen, peekRadius]);

  const maxRadius = useMemo(() => {
    if (!isOpen || typeof window === 'undefined') {
      return 3000;
    }

    return Math.hypot(window.innerWidth, window.innerHeight);
  }, [isOpen]);

  if (!hole || !isOpen) {
    return null;
  }

  const clipPath = `circle(var(--r-main) at ${hole.x}px ${hole.y}px)`;

  const maskStyle: MaskStyle = {
    '--r-main': '0px',
    clipPath,
    WebkitClipPath: clipPath,
    willChange: 'clip-path',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[70] overflow-hidden bg-gradient-to-b from-[#020205] via-[#0a0a1a] to-[#020205] text-white"
        initial={{ '--r-main': '0px' }}
        animate={{
          '--r-main': [
            '0px',
            `${hole.peekRadius}px`,
            `${hole.peekRadius}px`,
            `${maxRadius}px`,
          ],
        }}
        exit={{ opacity: 0 }}
        transition={{
          '--r-main': {
            duration: 1.5,
            times: [0, 0.2, 0.7, 1],
            ease: 'easeInOut',
          },
          opacity: { duration: 0.4 },
        }}
        style={maskStyle}
      >
        <div className="absolute inset-0 overflow-y-auto">
          {children}
        </div>
      </motion.div>

      <PortalRing
        x={hole.x}
        y={hole.y}
        delay={hole.delay}
        peekRadius={hole.peekRadius}
        maxRadius={maxRadius}
      />
    </>
  );
}
