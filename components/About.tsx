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

const MAX_REVEAL_GROUPS_PER_PARAGRAPH = 8;

const buildRevealGroups = (value: string, range: [number, number]) => {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const [rangeStart, rangeEnd] = range;
  const paragraphSpan = rangeEnd - rangeStart;
  const groupSize = Math.max(1, Math.ceil(words.length / MAX_REVEAL_GROUPS_PER_PARAGRAPH));

  return Array.from({ length: Math.ceil(words.length / groupSize) }, (_, groupIndex) => {
    const startWordIndex = groupIndex * groupSize;
    const endWordIndex = Math.min(startWordIndex + groupSize, words.length);

    return {
      id: groupIndex,
      range: [
        rangeStart + (startWordIndex / words.length) * paragraphSpan,
        rangeStart + (endWordIndex / words.length) * paragraphSpan,
      ] as [number, number],
      words: words.slice(startWordIndex, endWordIndex),
    };
  });
};

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
  const revealGroups = buildRevealGroups(value, range);

  return (
    <p className="mb-12 text-3xl font-bold leading-snug tracking-tight text-white brand-font md:text-5xl">
      {revealGroups.map((group) => (
        <RevealGroup
          key={group.id}
          progress={progress}
          range={group.range}
          words={group.words}
        />
      ))}
    </p>
  );
};

const RevealGroup = ({
  progress,
  range,
  words,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  words: string[];
}) => {
  const opacity = useTransform(progress, range, [0.1, 1]);

  return (
    <motion.span style={{ opacity }}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <Word>{word}</Word>{' '}
        </React.Fragment>
      ))}
    </motion.span>
  );
};

const Word = ({
  children,
}: {
  children: string;
}) => {
  const cleanedWord = children.replace(/[^\p{L}\p{N}]/gu, '');
  const isAgenzion = cleanedWord === 'Agenzion';

  return (
    <span className="relative inline-block">
      <span className="absolute inset-0 opacity-10">{children}</span>
      <span
        className={
          isAgenzion
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#4592AF] to-[#E3C4A8] bg-[length:200%_auto] animate-gradient-x'
            : ''
        }
      >
        {children}
      </span>
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
    <section ref={sectionRef} className="relative -mt-px bg-transparent py-32 px-4 md:px-12 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 34%, rgba(0,0,0,0) 100%)',
        }}
      />

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
