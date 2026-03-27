'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import useIsMobile from '@/lib/useIsMobile';
import { cn } from '@/lib/utils';
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

const SERVICES_GRID_CLASS =
  'relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-10';

const MobileServiceCard = memo(function MobileServiceCard({ service }: { service: Service }) {
  return (
    <article
      className="relative w-full overflow-hidden rounded-2xl border border-white/20 bg-[#0a0a12] p-8"
      style={{ contain: 'layout paint' }}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', service.gradient)} />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <h3 className="min-w-0 flex-1 text-2xl font-bold leading-[1.05] tracking-[-0.02em] text-white">
          {service.title}
        </h3>
      </div>

      <div className="relative z-10 mt-6">
        <p className="text-base font-light leading-relaxed text-gray-300">{service.description}</p>
      </div>
    </article>
  );
});

MobileServiceCard.displayName = 'MobileServiceCard';

interface DesktopServiceCardProps {
  service: Service;
  isActive: boolean;
  onToggle: (id: number) => void;
}

const DesktopServiceCard = memo(function DesktopServiceCard({
  service,
  isActive,
  onToggle,
}: DesktopServiceCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onToggle(service.id)}
      aria-expanded={isActive}
      whileTap={{ scale: 0.985 }}
      className="group relative self-start rounded-2xl p-[1px] text-left"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 blur-sm transition-opacity duration-200',
          service.gradient,
          isActive ? 'opacity-45' : 'group-hover:opacity-25'
        )}
      />

      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border bg-[#0a0a12]/80 p-8 backdrop-blur-sm transition-colors duration-200 md:p-10 shadow-2xl',
          isActive
            ? 'border-white/18 shadow-[0_0_18px_rgba(255,255,255,0.14)]'
            : 'border-white/5 group-hover:border-white/12 group-hover:shadow-[0_0_14px_rgba(255,255,255,0.1)]'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-500',
            service.gradient,
            isActive ? 'opacity-10' : ''
          )}
        />

        <div className="relative z-10 flex items-start justify-between gap-4 md:mb-2">
          <h3 className="min-w-0 flex-1 text-2xl font-bold leading-tight tracking-wide text-white drop-shadow-md md:text-3xl">
            {service.title}
          </h3>

          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 transition-[transform,background-color,border-color] duration-300 ease-out',
              isActive
                ? 'rotate-45 border-white/50 bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.18)]'
                : 'group-hover:border-white/35 group-hover:bg-white/5'
            )}
          >
            <span className="text-2xl font-light leading-none text-white">+</span>
          </div>
        </div>

        <div
          className="relative z-10 overflow-hidden transition-all duration-400 ease-in-out"
          style={{
            maxHeight: isActive ? '12rem' : '0px',
            marginTop: isActive ? '24px' : '0px',
          }}
        >
          <p
            className="text-base font-light leading-relaxed text-gray-300 transition-all duration-300 ease-in-out md:text-lg"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translate3d(0, 0, 0)' : 'translate3d(0, 8px, 0)',
            }}
          >
            {service.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
});

DesktopServiceCard.displayName = 'DesktopServiceCard';

const AnimatedServicesGrid = ({
  containerRef,
  children,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'start 25%'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div style={{ y, opacity }} className={SERVICES_GRID_CLASS}>
      {children}
    </motion.div>
  );
};

const Services: React.FC<{
  heading: string;
  services: readonly Service[];
}> = ({ heading, services }) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const handleToggle = useCallback((id: number) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-20 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent px-4 py-32 md:px-12"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(2,2,5,0.14) 12%, rgba(7,10,24,0.48) 40%, rgba(8,10,26,0.82) 74%, rgba(2,2,5,0.96) 100%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-[#020205]/30 to-transparent pointer-events-none" />
      {!isMobile ? <CosmicBackground planets={servicePlanets} masked /> : null}

      <div className="relative z-10 mx-auto mb-20 w-full max-w-7xl text-center">
        <h2 className="brand-font mb-6 text-4xl font-bold tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-6xl">
          {heading}
        </h2>
        <div className="mx-auto h-[1px] w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>

      {isMobile ? (
        <div className={SERVICES_GRID_CLASS}>
          {services.map((service) => (
            <MobileServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <AnimatedServicesGrid containerRef={containerRef}>
          {services.map((service) => (
            <DesktopServiceCard
              key={service.id}
              service={service}
              isActive={activeId === service.id}
              onToggle={handleToggle}
            />
          ))}
        </AnimatedServicesGrid>
      )}
    </section>
  );
};

export default Services;
