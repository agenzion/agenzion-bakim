'use client';

import React, { memo, useRef } from 'react';
import { motion, type MotionValue, useScroll, useTransform } from 'motion/react';
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
  'relative mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-7';

const CARD_BASE_PROGRESS = 0.04;
const CARD_STEP_PROGRESS = 0.19;
const CARD_TRAVEL_PROGRESS = 0.105;
const CARD_SETTLE_PROGRESS = 0.02;
const CARD_REVEAL_PROGRESS = 0.055;
const CARD_SETTLE_STRETCH_X = 0.03;
const CARD_SETTLE_STRETCH_Y = 0.018;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const easeInCubic = (value: number) => value * value * value;

interface ServiceCardProps {
  service: Service;
  index: number;
  progress: MotionValue<number>;
  className?: string;
}

const DesktopServiceCard = memo(function DesktopServiceCard({
  service,
  index,
  progress,
  className,
}: ServiceCardProps) {
  const start = CARD_BASE_PROGRESS + index * CARD_STEP_PROGRESS;
  const landed = start + CARD_TRAVEL_PROGRESS;
  const revealStart = landed + CARD_SETTLE_PROGRESS;
  const revealEnd = revealStart + CARD_REVEAL_PROGRESS;
  const arrivalProgress = useTransform(progress, (value) =>
    easeInCubic(clamp01((value - start) / CARD_TRAVEL_PROGRESS))
  );
  const settlePulse = useTransform(progress, (value) => {
    const phase = clamp01((value - landed) / CARD_SETTLE_PROGRESS);

    if (phase <= 0 || phase >= 1) {
      return 0;
    }

    return Math.sin(phase * Math.PI * 2) * (1 - phase);
  });
  const z = useTransform(arrivalProgress, [0, 1], [1600, 0]);
  const scale = useTransform(arrivalProgress, [0, 1], [6.2, 1]);
  const scaleX = useTransform(settlePulse, (pulse) => 1 + pulse * CARD_SETTLE_STRETCH_X);
  const scaleY = useTransform(settlePulse, (pulse) => 1 - pulse * CARD_SETTLE_STRETCH_Y);
  const y = useTransform(arrivalProgress, [0, 1], [-72, 0]);
  const opacity = useTransform(progress, [start, start + 0.025, landed], [0, 0.88, 1]);
  const rotateX = useTransform(arrivalProgress, [0, 1], [-9, 0]);
  const outerGlowOpacity = useTransform(progress, [start, revealStart, revealEnd], [0, 0, 0.35]);
  const innerTintOpacity = useTransform(progress, [start, revealStart, revealEnd], [0, 0, 0.08]);
  const contentOpacity = useTransform(progress, [start, revealStart, revealEnd], [0, 0, 1]);
  const contentY = useTransform(progress, [start, revealStart, revealEnd], [10, 10, 0]);

  return (
    <motion.article
      className={cn('relative min-h-[132px] self-start rounded-lg p-[1px]', className)}
      style={{
        opacity,
        scale,
        scaleX,
        scaleY,
        y,
        z,
        rotateX,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        backfaceVisibility: 'hidden',
        contain: 'layout paint',
        willChange: 'transform, opacity',
      }}
    >
      <motion.div
        className={cn(
          'absolute inset-0 rounded-lg bg-gradient-to-br blur-md',
          service.gradient
        )}
        style={{ opacity: outerGlowOpacity }}
      />
      <div className="relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-[#080b14]/82 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
        <motion.div
          className={cn('absolute inset-0 bg-gradient-to-br', service.gradient)}
          style={{ opacity: innerTintOpacity }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <motion.div className="relative z-10" style={{ opacity: contentOpacity, y: contentY }}>
          <h3 className="brand-font text-xl font-bold leading-tight tracking-wide text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.16)] md:text-[1.38rem]">
            {service.title}
          </h3>
          <p
            className="mt-2 overflow-hidden text-[0.78rem] font-light leading-[1.35] text-white/68 md:text-[0.82rem]"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
            }}
          >
            {service.description}
          </p>
        </motion.div>
      </div>
    </motion.article>
  );
});

DesktopServiceCard.displayName = 'DesktopServiceCard';

const MobileServiceCard = memo(function MobileServiceCard({ service }: { service: Service }) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.86, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#080b14]/88 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.34)]"
      style={{ contain: 'layout paint' }}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', service.gradient)} />
      <div className="relative z-10">
        <h3 className="brand-font text-2xl font-bold leading-tight tracking-wide text-white">
          {service.title}
        </h3>
        <p className="mt-4 text-sm font-light leading-relaxed text-white/68">
          {service.description}
        </p>
      </div>
    </motion.article>
  );
});

MobileServiceCard.displayName = 'MobileServiceCard';

const Services: React.FC<{
  heading: string;
  services: readonly Service[];
}> = ({ heading, services }) => {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const shouldCenterLastDesktopCard = services.length % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="relative z-20 bg-transparent md:h-[540vh]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(2,2,5,0.14) 12%, rgba(7,10,24,0.48) 40%, rgba(8,10,26,0.82) 74%, rgba(2,2,5,0.96) 100%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-[#020205]/30 to-transparent" />

      <div className="sticky top-0 z-10 hidden h-screen overflow-hidden px-4 md:block md:px-12">
        {!isMobile ? <CosmicBackground planets={servicePlanets} masked /> : null}
        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col items-center pt-[clamp(6.25rem,9vh,7.25rem)]">
          <div className="mb-10 w-full text-center">
            <h2 className="brand-font mb-6 text-4xl font-bold tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-6xl">
              {heading}
            </h2>
            <div className="mx-auto h-[1px] w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>

          <div className="relative w-full [perspective:1200px] [transform-style:preserve-3d]">
            <div className={SERVICES_GRID_CLASS}>
              {services.map((service, index) => (
                <DesktopServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  progress={scrollYProgress}
                  className={
                    shouldCenterLastDesktopCard && index === services.length - 1
                      ? 'md:col-span-2 md:mx-auto md:w-[calc(50%-0.875rem)]'
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 py-28 md:hidden">
        <div className="mx-auto mb-14 w-full max-w-7xl text-center">
          <h2 className="brand-font mb-6 text-4xl font-bold tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {heading}
          </h2>
          <div className="mx-auto h-[1px] w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>

        <div className={SERVICES_GRID_CLASS}>
          {services.map((service) => (
            <MobileServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
