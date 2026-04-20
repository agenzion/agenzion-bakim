'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const CIRCLE_SIZE = 64;
const STROKE_WIDTH = 3.5;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const MAX_ROTATION_SPEED = 760;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function ScrollToTopButton() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const coinRotateY = useMotionValue(0);
  const angleRef = useRef(0);
  const angularVelocityRef = useRef(0);
  const lastScrollRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number | null>(null);
  const lastScrollInputTimeRef = useRef(0);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.35,
  });
  const strokeDashoffset = useTransform(smoothProgress, [0, 1], [CIRCUMFERENCE, 0]);
  const label = pathname?.startsWith('/en') ? 'Back to top' : 'Yukarı dön';

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(window.scrollY > 240);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsVisible(latest > 240);

    if (prefersReducedMotion) {
      return;
    }

    const now = performance.now();
    const previousScroll = lastScrollRef.current;
    const previousTime = lastScrollTimeRef.current;

    lastScrollRef.current = latest;
    lastScrollTimeRef.current = now;

    if (previousScroll === null || previousTime === null) {
      return;
    }

    const scrollDelta = latest - previousScroll;
    const timeDelta = Math.max(now - previousTime, 12);
    const speed = scrollDelta / timeDelta;

    if (Math.abs(speed) < 0.01) {
      return;
    }

    const nextVelocity = clamp(speed * 210, -MAX_ROTATION_SPEED, MAX_ROTATION_SPEED);
    angularVelocityRef.current = angularVelocityRef.current * 0.55 + nextVelocity;
    lastScrollInputTimeRef.current = now;
  });

  useAnimationFrame((time, delta) => {
    if (prefersReducedMotion) {
      angleRef.current = 0;
      angularVelocityRef.current = 0;
      coinRotateY.set(0);
      return;
    }

    const frameDelta = Number.isFinite(delta) ? delta : 16.7;
    const deltaSeconds = Math.min(Math.max(frameDelta / 1000, 0.001), 0.04);
    const isIdle = time - lastScrollInputTimeRef.current > 100;
    const velocityDecay = isIdle ? 0.12 : 0.68;
    let velocity = angularVelocityRef.current * Math.pow(velocityDecay, deltaSeconds);
    let angle = angleRef.current + velocity * deltaSeconds;

    if (isIdle) {
      const targetAngle = Math.round(angle / 360) * 360;
      const settleStrength = Math.min(1, deltaSeconds * 3.2);

      angle += (targetAngle - angle) * settleStrength;

      if (Math.abs(velocity) < 4 && Math.abs(targetAngle - angle) < 0.12) {
        angle = targetAngle;
        velocity = 0;
      }
    }

    if (Math.abs(angle) > 100000) {
      angle %= 360;
    }

    angleRef.current = angle;
    angularVelocityRef.current = velocity;
    coinRotateY.set(angle);
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <motion.div
      initial={false}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-[80] md:bottom-8 md:right-8"
    >
      <button
        type="button"
        aria-label={label}
        title={label}
        tabIndex={isVisible ? 0 : -1}
        onClick={handleClick}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full text-white outline-none [perspective:720px]"
      >
        <motion.span
          className="absolute inset-0 rounded-full [transform-style:preserve-3d]"
          style={{ rotateY: coinRotateY, transformStyle: 'preserve-3d' }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center rounded-full"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
            >
              <circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={STROKE_WIDTH}
              />
              <motion.circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="#89C8DE"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                style={{ strokeDashoffset }}
              />
            </svg>
            <span className="absolute inset-[0.45rem] rounded-full border border-white/15 bg-black/80 shadow-[0_18px_42px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors duration-200 group-hover:bg-black group-focus-visible:bg-black" />
            <ArrowUp
              aria-hidden="true"
              className="relative h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5"
              strokeWidth={2.3}
            />
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center rounded-full"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="absolute inset-[0.45rem] rounded-full border border-white/15 bg-black/80 shadow-[0_18px_42px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors duration-200 group-hover:bg-black group-focus-visible:bg-black" />
            <span className="relative h-7 w-7">
              <Image src="/images/alogo.png" alt="" fill sizes="28px" className="object-contain" />
            </span>
          </span>
        </motion.span>
      </button>
    </motion.div>
  );
}
