'use client';

import Image from 'next/image';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { ABOUT_STARFLOW_EVENT, type AboutStarflowDetail } from '@/lib/aboutStarflow';
import CosmicBackground from './CosmicBackground';
import StarTextManifesto from './StarTextManifesto';

type ManifestoSection = {
  title: string;
  text: string;
  showsFooter?: boolean;
};

interface HeadlessCommerceSectionProps {
  sections: readonly ManifestoSection[];
  indicatorLabel: string;
  footerCopy: {
    copyrightName: string;
  };
}

const ASTRONAUT_IMAGE_SRC = '/images/space/astronaut.png';

const HeadlessCommerceSection = ({
  sections,
  indicatorLabel,
  footerCopy,
}: HeadlessCommerceSectionProps) => {
  const reducedMotion = useReducedMotion();
  const astronautGustX = useMotionValue(0);
  const astronautGustY = useMotionValue(0);
  const astronautGustScale = useMotionValue(1);
  const gustAnimationsRef = useRef<Array<{ stop: () => void }>>([]);

  useEffect(() => {
    if (reducedMotion) {
      astronautGustX.set(0);
      astronautGustY.set(0);
      astronautGustScale.set(1);
      return;
    }

    const stopGustAnimations = () => {
      gustAnimationsRef.current.forEach((animation) => animation.stop());
      gustAnimationsRef.current = [];
    };

    const handleStarflow = (event: Event) => {
      const { detail } = event as CustomEvent<AboutStarflowDetail>;
      const direction = detail.direction === -1 ? -1 : 1;
      const intensity = Math.min(1.65, Math.max(0.85, detail.intensity ?? 1));
      const xBurst = 26 * intensity * direction;
      const yBurst = 12 * intensity * direction;

      stopGustAnimations();
      gustAnimationsRef.current = [
        animate(astronautGustX, [astronautGustX.get(), xBurst, xBurst * 0.3, 0], {
          duration: 1.34,
          ease: 'easeInOut',
          times: [0, 0.28, 0.66, 1],
        }),
        animate(astronautGustY, [astronautGustY.get(), yBurst, yBurst * 0.28, 0], {
          duration: 1.2,
          ease: 'easeInOut',
          times: [0, 0.3, 0.68, 1],
        }),
        animate(astronautGustScale, [1, 1.03, 0.995, 1], {
          duration: 1.08,
          ease: 'easeInOut',
          times: [0, 0.3, 0.7, 1],
        }),
      ];
    };

    window.addEventListener(ABOUT_STARFLOW_EVENT, handleStarflow as EventListener);

    return () => {
      window.removeEventListener(ABOUT_STARFLOW_EVENT, handleStarflow as EventListener);
      stopGustAnimations();
    };
  }, [astronautGustScale, astronautGustX, astronautGustY, reducedMotion]);

  return (
    <section className="relative z-20 min-h-[100dvh] overflow-visible bg-transparent">
      <div aria-hidden="true" className="pointer-events-none sticky top-0 h-[100dvh] w-full">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#020205_0%,#040712_38%,#070a17_74%,#020205_100%)]" />
          <CosmicBackground masked />
        </div>

        <div className="absolute left-1/2 top-[10%] z-10 hidden h-[clamp(5rem,7vw,8rem)] w-[clamp(5rem,7vw,8rem)] -translate-x-[68%] md:block">
          <div className="absolute inset-[16%] rounded-full bg-[#8cc7e0]/12 blur-2xl" />
          <motion.div
            className="relative h-full w-full opacity-75"
            style={{ x: astronautGustX, y: astronautGustY, scale: astronautGustScale }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          >
            <Image
              src={ASTRONAUT_IMAGE_SRC}
              alt=""
              fill
              sizes="(min-width: 1024px) 8rem, (min-width: 768px) 7rem, 5rem"
              className="object-contain"
              style={{ filter: 'brightness(0.82) saturate(0.9) contrast(0.98)' }}
            />
          </motion.div>
        </div>
      </div>

      <div className="relative z-20 -mt-[100dvh]">
        <StarTextManifesto
          sections={sections}
          indicatorLabel={indicatorLabel}
          footerCopy={footerCopy}
          allowPageScrollAtEdges
          scrollDriven
        />
      </div>
    </section>
  );
};

export default HeadlessCommerceSection;
