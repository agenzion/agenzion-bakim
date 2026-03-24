'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import Image from 'next/image';
import { ArrowUpRight, Hexagon } from 'lucide-react';
import PlanetBackdrop, { PlanetSpec } from './PlanetBackdrop';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  img: string;
  color: string;
  tags: readonly string[];
}

const backgroundStars = Array.from({ length: 84 }, (_, i) => ({
  id: i,
  top: `${(i * 13) % 100}%`,
  left: `${(i * 23) % 100}%`,
  size: (i % 3) + 1,
  duration: `${2.2 + (i % 5) * 0.65}s`,
  delay: `${(i % 7) * 0.3}s`,
}));

const shootingStars = [
  { id: 1, top: '10%', left: '70%', duration: '8s', delay: '0.6s' },
  { id: 2, top: '24%', left: '84%', duration: '7s', delay: '3.4s' },
  { id: 3, top: '38%', left: '66%', duration: '8.5s', delay: '5.2s' },
];

const showcasePlanets: PlanetSpec[] = [
  {
    id: 'jupiter',
    name: 'Jupiter',
    src: '/images/space/jupiter.jpg',
    size: 'clamp(150px, 18vw, 300px)',
    top: '12%',
    right: '-3%',
    opacity: 0.42,
    imageScale: 1.28,
    animateFloat: false,
    animateTexture: false,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    src: '/images/space/neptun.jpg',
    size: 'clamp(104px, 12vw, 190px)',
    top: '44%',
    left: '4%',
    opacity: 0.42,
    imageScale: 1.28,
    animateFloat: false,
    animateTexture: false,
  },
  {
    id: 'pluto',
    name: 'Pluto',
    src: '/images/space/pluto.jpg',
    size: 'clamp(72px, 8vw, 132px)',
    top: '72%',
    right: '2%',
    opacity: 0.42,
    imageScale: 1.28,
    animateFloat: false,
    animateTexture: false,
  },
];

const glowFadeMask = 'linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)';

const StarryBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {backgroundStars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.2,
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
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_10px_3px_rgba(255,255,255,0.9)]"></div>
        </div>
      ))}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); box-shadow: 0 0 8px rgba(255,255,255,0.6); }
        }
        @keyframes shooting-star {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          10% { transform: rotate(215deg) translateX(800px); opacity: 0; }
          100% { transform: rotate(215deg) translateX(800px); opacity: 0; }
        }
        @keyframes voyager-spin {
          from { transform: rotate(30deg); }
          to { transform: rotate(390deg); }
        }
      `}</style>
    </div>
  );
};

const Showcase: React.FC<{
  heading: string;
  voyagerLabel: string;
  projects: readonly Project[];
}> = ({ heading, voyagerLabel, projects }) => {
  const container = useRef<HTMLDivElement>(null);

  // Track scroll of the entire section
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Dynamic Background Glow Color - Synchronized with card transitions
  const glowColor = useTransform(
    scrollYProgress,
    projects.flatMap((_, i) => {
      const start = i / projects.length;
      const end = (i + 1) / projects.length;
      // Create a "plateau" for each color so it stays solid while the card is active
      // and transitions quickly between cards
      return [start + 0.02, end - 0.02];
    }),
    projects.flatMap((p) => [p.color, p.color])
  );

  return (
    <div ref={container} className="relative bg-gradient-to-b from-[#020205] via-[#0a0a1a] to-[#020205] w-full">
      <PlanetBackdrop planets={showcasePlanets} />
      <StarryBackground />
      
      {/* New Section Header */}
      <div className="pt-32 pb-16 text-center relative z-30">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold brand-font text-white mb-6 tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          {heading}
        </motion.h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
      </div>

      <div style={{ height: `${projects.length * 100}vh` }} className="relative">
        {/* Section Header (Empty container removed in previous step, now fully gone) */}

        {/* Dynamic Glow Background */}
        <div
          aria-hidden="true"
          className="sticky top-0 flex h-screen w-full items-center justify-center pointer-events-none"
          style={{
            maskImage: glowFadeMask,
            WebkitMaskImage: glowFadeMask,
          }}
        >
          <motion.div
            style={{ backgroundColor: glowColor }}
            className="h-[72vw] w-[72vw] max-h-[1200px] max-w-[1200px] rounded-full blur-[190px] opacity-20"
          />
        </div>

        {/* Stacking Cards */}
        <div className="absolute top-0 w-full">
          {projects.map((project, i) => {
            const range = [i * (1 / projects.length), 1];
            const targetScale = 1 - (projects.length - 1 - i) * 0.05;

            return (
              <Card
                key={project.id}
                i={i}
                {...project}
                progress={scrollYProgress}
                range={range}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>

      <div className="relative z-30 flex justify-center pb-12 md:pb-20 pointer-events-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-[90px] w-[90px] md:h-[128px] md:w-[128px] rounded-full bg-cyan-300/30 blur-2xl" />
          <div className="absolute h-[54px] w-[54px] md:h-[72px] md:w-[72px] rounded-full bg-white/35 blur-xl" />
          <div className="absolute left-[calc(100%-6px)] top-1/2 hidden md:flex items-center gap-3 -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.2, delay: 0.25, ease: 'easeOut' }}
              className="h-px w-24 origin-left bg-gradient-to-r from-cyan-200/90 to-white/20"
            />
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.9, delay: 0.9, ease: 'easeOut' }}
              className="whitespace-nowrap text-[11px] uppercase tracking-[0.45em] text-cyan-100/85"
            >
              {voyagerLabel}
            </motion.span>
          </div>
          <Image
            src="/images/space/voyager-1.png"
            alt="Voyager 1"
            width={112}
            height={112}
            sizes="(min-width: 768px) 112px, 84px"
            className="relative h-[84px] w-[84px] md:h-[112px] md:w-[112px] object-contain opacity-95 [animation:voyager-spin_14s_linear_infinite]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};

interface CardProps extends Project {
  i: number;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({
  i,
  title,
  category,
  description,
  img,
  color,
  tags,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen sticky top-0 flex items-start justify-center p-4 md:p-8 overflow-hidden"
    >
      <motion.div
        style={{
          scale,
          marginTop: `calc(5vh + ${i * 20}px)`,
        }}
        className="relative w-full max-w-6xl aspect-square md:aspect-[2/1] rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left Column: Info */}
        <div className="p-8 md:p-12 flex flex-col justify-between h-full relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/80 logo-font">
                {category}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase leading-[0.9] brand-font">
              {title}
            </h3>
            <div className="relative pl-4">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{ backgroundColor: color }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  boxShadow: [
                    `0 0 0px ${color}`, 
                    `0 0 15px ${color}`, 
                    `0 0 0px ${color}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-md logo-font">
                {description}
              </p>
            </div>
          </div>

          {/* Footer / Tags */}
          <div className="flex flex-wrap gap-2 md:gap-4 mt-8">
            <div className="ml-auto flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest group cursor-pointer hover:text-white transition-colors">
              Projeyi İncele{' '}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Right Column: Visual */}
        <div className="relative h-full w-full overflow-hidden rounded-r-3xl md:rounded-l-none rounded-b-3xl md:rounded-br-3xl hidden md:block">
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src={img} 
              alt={title} 
              fill 
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-neutral-900/90"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Tech Decoration */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <div className="w-12 h-12 rounded-full backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <Hexagon className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Mobile Image Overlay (Subtle background) */}
        <div className="md:hidden absolute inset-0 -z-10 opacity-30">
          <Image 
            src={img} 
            alt={title}
            fill 
            sizes="100vw"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Showcase;
