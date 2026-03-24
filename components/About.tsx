'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

const transitionStars = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  top: `${(i * 13 + 7) % 100}%`,
  left: `${(i * 31 + 19) % 100}%`,
  size: (i % 2) + 1,
  opacity: 0.04 + ((i % 5) * 0.02),
  duration: `${3.8 + (i % 4) * 1.1}s`,
  delay: `${(i % 7) * 0.22}s`,
}));

// --- Scroll Reveal Text Components ---
const Paragraph = ({
  value,
  progress,
  range,
}: {
  value: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const words = value.split(' ');
  return (
    <p
      className="text-3xl md:text-5xl font-bold leading-snug tracking-tight flex flex-wrap gap-x-3 gap-y-2 brand-font text-white mb-12"
    >
      {words.map((word, i) => {
        const [rangeStart, rangeEnd] = range;
        const paragraphProgress = rangeEnd - rangeStart;
        const start = rangeStart + (i / words.length) * paragraphProgress;
        const end = rangeStart + ((i + 1) / words.length) * paragraphProgress;
        return (
          <Word key={i} range={[start, end]} progress={progress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word = ({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const isAgenzion = children.replace(/[^\p{L}\p{N}]/gu, '') === 'Agenzion';

  return (
    <span className="relative">
      <span className="absolute opacity-10">{children}</span>
      <motion.span 
        style={{ opacity }}
        className={isAgenzion ? "text-transparent bg-clip-text bg-gradient-to-r from-[#4592AF] to-[#E3C4A8] bg-[length:200%_auto] animate-gradient-x" : ""}
      >
        {children}
      </motion.span>
    </span>
  );
};

const About: React.FC<{
  paragraphs: readonly string[];
}> = ({ paragraphs }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.82', 'end 0.5'],
  });

  return (
    <section ref={sectionRef} className="relative bg-black py-32 px-4 md:px-12 overflow-hidden border-t border-white/5">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 34%, rgba(0,0,0,0.78) 100%)',
        }}
      />
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4592AF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,1) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,1) 100%)',
        }}
      >
        {transitionStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: '0 0 8px rgba(255,255,255,0.35)',
              animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-5xl">
          {/* Manifesto (Scroll Reveal) */}
          <Paragraph
            value={paragraphs[0] || ''}
            progress={scrollYProgress}
            range={[0, 0.28]}
          />
          <Paragraph
            value={paragraphs[1] || ''}
            progress={scrollYProgress}
            range={[0.31, 0.59]}
          />
          <Paragraph
            value={paragraphs[2] || ''}
            progress={scrollYProgress}
            range={[0.62, 0.9]}
          />
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.04; transform: scale(0.9); }
          50% { opacity: 0.16; transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
};

export default About;
