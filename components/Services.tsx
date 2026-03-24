'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { PlanetSpec } from './PlanetBackdrop';
import CosmicBackground from './CosmicBackground';

interface Service {
  id: number;
  title: string;
  description: string;
  gradient: string;
}

const servicePlanets: PlanetSpec[] = [
  {
    id: 'mars',
    name: 'Mars',
    src: '/images/space/mars.jpg',
    size: 'clamp(120px, 14vw, 240px)',
    top: '14%',
    left: '-3%',
    opacity: 0.44,
    imageScale: 1.28,
    duration: 26,
    driftX: '3%',
    driftY: '-2%',
  },
];

const ServiceCard = ({ service, isActive, onClick }: { service: Service, isActive: boolean, onClick: () => void }) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className="relative p-[1px] rounded-2xl cursor-pointer group self-start"
    >
      {/* Lightweight hover glow */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 blur-sm transition-opacity duration-200 ${isActive ? 'opacity-45' : 'group-hover:opacity-25'}`}></div>
      

      {/* Card Content */}
      <div className={`relative bg-[#0a0a12]/80 backdrop-blur-xl border rounded-2xl p-8 md:p-10 overflow-hidden shadow-2xl transition-colors duration-200 ${isActive ? 'border-white/18 shadow-[0_0_18px_rgba(255,255,255,0.14)]' : 'border-white/5 group-hover:border-white/12 group-hover:shadow-[0_0_14px_rgba(255,255,255,0.1)]'}`}>

        {/* Subtle inner gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5 transition-opacity duration-500 ${isActive ? 'opacity-10' : ''}`}></div>
        
        <div className="relative z-10 flex items-start justify-between gap-4 mb-2">
          <h3 className="min-w-0 flex-1 text-2xl md:text-3xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
            {service.title}
          </h3>
          
          {/* Expand/Collapse Icon */}
          <div className={`shrink-0 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-200 ${isActive ? 'rotate-45 bg-white/10 border-white/50 shadow-[0_0_12px_rgba(255,255,255,0.18)]' : 'group-hover:bg-white/5 group-hover:border-white/35'}`}>
            <span className="text-white text-2xl leading-none font-light">+</span>
          </div>
        </div>
        
        {/* Expandable Description */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden relative z-10"
            >
              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Services: React.FC<{
  heading: string;
  services: readonly Service[];
}> = ({ heading, services }) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll animations for the services container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "start 25%"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen bg-gradient-to-b from-[#020205] via-[#0a0a1a] to-[#020205] py-32 px-4 md:px-12 flex flex-col items-center justify-center z-20 overflow-hidden"
    >
      <CosmicBackground planets={servicePlanets} masked />
      
      {/* Section Header */}
      <div className="relative z-10 w-full max-w-7xl mx-auto mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold brand-font text-white mb-6 tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {heading}
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
      </div>

      {/* Services Grid */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start"
      >
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isActive={activeId === service.id}
            onClick={() => setActiveId(activeId === service.id ? null : service.id)}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default Services;
