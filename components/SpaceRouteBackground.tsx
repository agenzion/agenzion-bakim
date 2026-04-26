'use client';

import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';
import { stripLocalePrefix } from '@/lib/i18n';

const PANORAMA_VIEWPORTS = 3;
const SKY_ROUTE_INDEX = {
  blog: 1,
  contact: 2,
} as const;
const SATURN_IMAGE_SRC =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Saturnx.png/960px-Saturnx.png?_=20150805205322';

type SkyRoute = keyof typeof SKY_ROUTE_INDEX;

interface StarSpec {
  id: string;
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  blur: number;
  glow: number;
}

interface ShootingStarSpec {
  id: string;
  top: string;
  left: string;
  duration: number;
  delay: number;
  length: number;
  angle: number;
  opacity: number;
}

interface GlowSpec {
  id: string;
  width: string;
  height: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  background: string;
  opacity: number;
  blur: string;
}

interface ClusterSpec {
  x: number;
  y: number;
  spreadX: number;
  spreadY: number;
  weight: number;
}

const PANORAMA_BASE =
  'radial-gradient(circle at 8% 16%, rgba(78, 157, 217, 0.22) 0%, rgba(78, 157, 217, 0.05) 14%, transparent 26%), radial-gradient(circle at 19% 72%, rgba(89, 110, 204, 0.16) 0%, transparent 18%), radial-gradient(circle at 35% 22%, rgba(236, 194, 154, 0.12) 0%, transparent 14%), radial-gradient(circle at 50% 18%, rgba(86, 163, 200, 0.18) 0%, rgba(86, 163, 200, 0.04) 14%, transparent 26%), radial-gradient(circle at 65% 68%, rgba(76, 96, 184, 0.16) 0%, transparent 18%), radial-gradient(circle at 84% 14%, rgba(82, 170, 228, 0.24) 0%, rgba(82, 170, 228, 0.05) 15%, transparent 28%), radial-gradient(circle at 92% 54%, rgba(224, 184, 138, 0.1) 0%, transparent 14%), linear-gradient(180deg, #01030a 0%, #040916 42%, #020307 100%)';

const PANORAMA_GLOWS: GlowSpec[] = [
  {
    id: 'glow-1',
    top: '-8%',
    left: '3%',
    width: '52vw',
    height: '52vw',
    background:
      'radial-gradient(circle, rgba(84, 169, 220, 0.30) 0%, rgba(84, 169, 220, 0.07) 44%, transparent 74%)',
    opacity: 0.72,
    blur: '56px',
  },
  {
    id: 'glow-2',
    top: '-8%',
    left: '37%',
    width: '46vw',
    height: '46vw',
    background:
      'radial-gradient(circle, rgba(233, 192, 146, 0.18) 0%, rgba(86, 163, 200, 0.10) 44%, transparent 74%)',
    opacity: 0.76,
    blur: '52px',
  },
  {
    id: 'glow-3',
    top: '-8%',
    left: '72%',
    width: '54vw',
    height: '54vw',
    background:
      'radial-gradient(circle, rgba(84, 173, 226, 0.28) 0%, rgba(89, 104, 198, 0.08) 44%, transparent 74%)',
    opacity: 0.78,
    blur: '58px',
  },
];

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const round = (value: number, digits = 2) => {
  return Number(value.toFixed(digits));
};

const createRandom = (seed: number) => {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const weightedPick = (clusters: ClusterSpec[], random: () => number) => {
  const totalWeight = clusters.reduce((sum, cluster) => sum + cluster.weight, 0);
  const target = random() * totalWeight;
  let cumulative = 0;

  for (const cluster of clusters) {
    cumulative += cluster.weight;
    if (target <= cumulative) {
      return cluster;
    }
  }

  return clusters[clusters.length - 1];
};

const createPanoramaStars = (seed: number, count: number, clusters: ClusterSpec[]) => {
  const random = createRandom(seed);

  return Array.from({ length: count }, (_, index) => {
    const dispersed = random() < 0.24;
    const cluster = dispersed ? null : weightedPick(clusters, random);
    const x = dispersed
      ? random() * 100
      : clamp(
          cluster!.x + (random() - 0.5) * cluster!.spreadX + (random() - 0.5) * 10,
          -6,
          106
        );
    const y = dispersed
      ? random() * 100
      : clamp(
          cluster!.y + (random() - 0.5) * cluster!.spreadY + (random() - 0.5) * 8,
          -10,
          110
        );
    const brightness = random();
    const size =
      brightness > 0.9
        ? 1.9 + random() * 1.5
        : brightness > 0.56
          ? 1.15 + random() * 1.1
          : 0.65 + random() * 0.85;
    const opacity =
      brightness > 0.9
        ? 0.42 + random() * 0.16
        : brightness > 0.56
          ? 0.24 + random() * 0.16
          : 0.1 + random() * 0.12;

    return {
      id: `panorama-star-${index}`,
      top: `${round(y)}%`,
      left: `${round(x)}%`,
      size: round(size),
      opacity: round(opacity),
      duration: round(3.8 + random() * 5.8),
      delay: round(random() * 5.2),
      blur: brightness > 0.9 ? round(0.3 + random() * 0.8) : 0,
      glow: brightness > 0.72 ? round(0.12 + random() * 0.28) : 0,
    };
  });
};

const PANORAMA_STARS = createPanoramaStars(91024, 90, [
  { x: 8, y: 20, spreadX: 18, spreadY: 20, weight: 2.6 },
  { x: 19, y: 68, spreadX: 18, spreadY: 18, weight: 1.8 },
  { x: 34, y: 26, spreadX: 22, spreadY: 18, weight: 1.8 },
  { x: 49, y: 40, spreadX: 26, spreadY: 24, weight: 3.2 },
  { x: 62, y: 24, spreadX: 20, spreadY: 18, weight: 2.1 },
  { x: 74, y: 70, spreadX: 18, spreadY: 18, weight: 1.6 },
  { x: 86, y: 18, spreadX: 20, spreadY: 18, weight: 2.7 },
  { x: 93, y: 58, spreadX: 14, spreadY: 16, weight: 1.7 },
]);

const PANORAMA_SHOOTING_STARS: ShootingStarSpec[] = [
  { id: 'shoot-1', top: '14%', left: '23%', duration: 11.5, delay: 1.1, length: 152, angle: 214, opacity: 0.82 },
  { id: 'shoot-2', top: '28%', left: '49%', duration: 12.8, delay: 4.6, length: 136, angle: 212, opacity: 0.76 },
  { id: 'shoot-3', top: '20%', left: '81%', duration: 10.9, delay: 2.8, length: 148, angle: 216, opacity: 0.84 },
  { id: 'shoot-4', top: '54%', left: '65%', duration: 14.2, delay: 7.1, length: 122, angle: 206, opacity: 0.66 },
];

const getSkyRoute = (pathname: string): SkyRoute | null => {
  const path = stripLocalePrefix(pathname);

  if (path === '/blog') {
    return 'blog';
  }

  if (path.startsWith('/blog/')) {
    return 'contact';
  }

  return null;
};

const SpaceRouteBackground = () => {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const route = getSkyRoute(pathname);

  if (!route) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0 h-screen w-full overflow-hidden bg-[#020205] [height:100lvh]"
      />
    );
  }

  const routeIndex = SKY_ROUTE_INDEX[route];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-screen w-full overflow-hidden bg-[#020205] [height:100lvh]"
    >
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{
          width: `${PANORAMA_VIEWPORTS * 100}vw`,
          willChange: 'transform',
        }}
        initial={false}
        animate={{ x: `-${routeIndex * 100}vw` }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: 1.6,
                ease: [0.22, 1, 0.36, 1],
              }
        }
      >
        <div
          className="absolute inset-0"
          style={{ background: PANORAMA_BASE }}
        />

        {PANORAMA_GLOWS.map((glow) => (
          <div
            key={glow.id}
            className="absolute rounded-full"
            style={{
              top: glow.top,
              right: glow.right,
              bottom: glow.bottom,
              left: glow.left,
              width: glow.width,
              height: glow.height,
              background: glow.background,
              opacity: glow.opacity,
              filter: `blur(${glow.blur})`,
            }}
          />
        ))}

        {PANORAMA_STARS.map((star) => {
          const style = {
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            filter: star.blur ? `blur(${star.blur}px)` : undefined,
            boxShadow: star.glow ? `0 0 14px rgba(255,255,255,${star.glow})` : undefined,
            '--space-star-opacity': `${star.opacity}`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          } as CSSProperties;

          return (
            <div
              key={star.id}
              className="space-sky-star absolute rounded-full bg-white"
              style={style}
            />
          );
        })}

        {PANORAMA_SHOOTING_STARS.map((star) => {
          const style = {
            top: star.top,
            left: star.left,
            width: `${star.length}px`,
            '--space-shoot-angle': `${star.angle}deg`,
            '--space-shoot-opacity': `${star.opacity}`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          } as CSSProperties;

          return (
            <div
              key={star.id}
              className="space-sky-shoot absolute h-px"
              style={style}
            >
              <div className="absolute right-0 top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.82)]" />
            </div>
          );
        })}

        <div
          className="absolute"
          style={{
            left: 'calc(100vw + 79vw)',
            top: 'clamp(9.4rem, 13vw, 11rem)',
            width: 'clamp(5rem, 7vw, 8rem)',
            height: 'clamp(5rem, 7vw, 8rem)',
          }}
        >
          <div className="absolute inset-[18%] rounded-full bg-[#7fb7d8]/12 blur-2xl" />
          <div className="relative h-full w-full opacity-78">
            <Image
              src={SATURN_IMAGE_SRC}
              alt=""
              fill
              sizes="(min-width: 1024px) 8rem, (min-width: 768px) 7rem, (min-width: 640px) 6rem, 5rem"
              className="object-contain"
              referrerPolicy="no-referrer"
              style={{
                filter: 'brightness(0.78) saturate(0.82) contrast(0.96)',
              }}
            />
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(0,0,0,0.22)_74%,rgba(0,0,0,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,transparent_16%,transparent_80%,rgba(0,0,0,0.28)_100%)]" />
      </motion.div>
    </div>
  );
};

export default SpaceRouteBackground;
