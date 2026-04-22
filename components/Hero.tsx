'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import BrandLogo from './BrandLogo';
import LanguageSwitch from './LanguageSwitch';
import type { NavigationCopy } from './navigation';
import { type Locale, getLocalizedPath } from '@/lib/i18n';
import useIsMobile from '@/lib/useIsMobile';

const Hero: React.FC<{
  locale: Locale;
  alternatePath: string;
  copy: {
    primaryTitle: string;
    secondaryTitle: string;
    scrollLabel: string;
  };
  navigation: NavigationCopy;
}> = ({ locale, alternatePath, copy, navigation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Tall container for scroll runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // --- TIMING CONFIGURATION ---
  const END_MOVEMENT = 0.7;
  const TEXT_FADE_START = 0.7;
  const TEXT_FADE_END = 0.8;
  const TEXT1_FADE_START = isMobile ? 0.32 : 0.4;
  const TEXT1_FADE_END = isMobile ? 0.44 : 0.5;

  // BACKGROUND INTERPOLATION
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.5, END_MOVEMENT],
    ['#F5F5F3', '#000000']
  );

  // TEXT TRANSITIONS
  const text1Opacity = useTransform(scrollYProgress, [TEXT1_FADE_START, TEXT1_FADE_END], [1, 0]);
  const text1Y = useTransform(scrollYProgress, [TEXT1_FADE_START, TEXT1_FADE_END], [0, -50]);
  const text1Scale = useTransform(scrollYProgress, [TEXT1_FADE_START, TEXT1_FADE_END], [1, 0.9]);

  // Phase 2 (Eclipse/Dark mode text)
  const text2Opacity = useTransform(scrollYProgress, [TEXT_FADE_START, TEXT_FADE_END], [0, 1]);
  const text2Y = useTransform(scrollYProgress, [TEXT_FADE_START, TEXT_FADE_END], [50, 0]);

  // --- CELESTIAL ANIMATIONS ---
  const moonX = useTransform(
    scrollYProgress,
    [0, END_MOVEMENT],
    [isMobile ? '42vw' : '40vw', '0vw']
  );
  const moonY = useTransform(
    scrollYProgress,
    [0, END_MOVEMENT],
    [isMobile ? '18vh' : '20vh', '0vh']
  );
  const moonScale = useTransform(
    scrollYProgress,
    [0, END_MOVEMENT],
    [isMobile ? 0.72 : 0.8, 1.01]
  );
  const SUN_IMAGE_SRC = '/images/space/sun.jpg';
  const MOON_IMAGE_SRC = '/images/space/moon.jpg';

  // SUN GLOW / CORONA EFFECT
  const sunShadow = useTransform(
    scrollYProgress,
    [0.5, END_MOVEMENT - 0.05, END_MOVEMENT],
    [
      '0px 0px 120px 40px rgba(255, 140, 0, 0.5), 0px 0px 60px 20px rgba(255, 200, 50, 0.7)',
      '0px 0px 60px 20px rgba(255, 140, 0, 0.3), 0px 0px 20px 10px rgba(255, 200, 50, 0.5)',
      '0px 0px 20px 5px rgba(255, 255, 255, 1), 0px 0px 80px 20px rgba(255, 255, 255, 0.8), 0px 0px 150px 40px rgba(150, 200, 255, 0.5), 0px 0px 300px 80px rgba(100, 150, 255, 0.2)',
    ]
  );

  const sunColor = useTransform(
    scrollYProgress,
    [END_MOVEMENT - 0.02, END_MOVEMENT],
    ['#FF8C00', '#000000']
  );

  const navColor = useTransform(scrollYProgress, [0.5, END_MOVEMENT], ['#333', '#FFF']);
  const darkLogoOpacity = useTransform(scrollYProgress, [0.5, END_MOVEMENT], [1, 0]);
  const lightLogoOpacity = useTransform(scrollYProgress, [0.5, END_MOVEMENT], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[450vh]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between p-5 md:p-8">
        <Link href={getLocalizedPath(locale, 'home')} className="block shrink-0">
          <BrandLogo
            darkOpacity={darkLogoOpacity}
            lightOpacity={lightLogoOpacity}
            priority
          />
        </Link>
        <div className="flex items-center gap-4 md:gap-8">
          <Link href={getLocalizedPath(locale, 'blog')}>
            <motion.span style={{ color: navColor }} className="text-sm font-medium">{navigation.blog}</motion.span>
          </Link>
          <motion.span
            aria-hidden="true"
            style={{ backgroundColor: navColor }}
            className="h-4 w-px"
          />
          <LanguageSwitch locale={locale} href={alternatePath} color={navColor} />
        </div>
      </nav>

      {/* Sticky Viewport */}
      <motion.div
        style={{ backgroundColor }}
        className="hero-sticky-viewport sticky top-0 w-full overflow-hidden flex items-center justify-center z-10 transition-colors duration-0"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-10 px-5 pt-0 md:flex-row md:justify-between md:gap-0 md:px-24">
          {/* Text Content */}
          <div className="relative z-40 hidden w-full items-center justify-center pointer-events-none md:flex md:w-1/2 md:justify-start">
            <div className="relative flex h-[120px] w-full items-center justify-center md:h-[400px] md:justify-start">
              {/* --- TEXT PHASE 1 --- */}
              <motion.div
                style={{ opacity: text1Opacity, y: text1Y, scale: text1Scale }}
                className="absolute z-40 w-full text-center md:text-left"
              >
                <h1 className="mx-auto max-w-[9ch] text-[clamp(3.2rem,15vw,5rem)] font-extrabold tracking-tighter text-gray-900 md:mx-0 md:max-w-none md:text-8xl">
                  {copy.primaryTitle}
                </h1>
              </motion.div>

              {/* --- TEXT PHASE 2 (TOTALITY) --- */}
              <motion.div
                style={{ opacity: text2Opacity, y: text2Y }}
                className="absolute z-40 w-full text-center mix-blend-screen md:text-left"
              >
                <h1
                  className="mx-auto max-w-[10ch] text-[clamp(2.5rem,12vw,4rem)] font-extrabold tracking-tight text-white md:mx-0 md:max-w-none md:text-7xl"
                  style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}
                >
                  {copy.secondaryTitle}
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Celestial System */}
          <div className="relative flex w-full items-center justify-center md:w-1/2 md:justify-end">
            <div className="relative flex h-[260px] w-[260px] items-center justify-center md:h-[600px] md:w-[600px]">
              <motion.div
                style={{ opacity: text1Opacity, y: text1Y, scale: text1Scale }}
                className="absolute inset-0 z-40 flex items-center justify-center px-6 text-center pointer-events-none md:hidden"
              >
                <h1 className="max-w-[8ch] text-[clamp(2rem,9vw,2.7rem)] font-extrabold leading-[0.92] tracking-tighter text-gray-950">
                  {copy.primaryTitle}
                </h1>
              </motion.div>

              <motion.div
                style={{ x: moonX, y: moonY, scale: moonScale, opacity: text2Opacity }}
                className="absolute inset-0 z-40 flex items-center justify-center px-6 text-center pointer-events-none md:hidden"
              >
                <motion.h1
                  style={{ y: text2Y, textShadow: '0 0 30px rgba(255,255,255,0.5)' }}
                  className="max-w-[7ch] text-[clamp(1.8rem,8.4vw,2.4rem)] font-extrabold leading-[0.94] tracking-tight text-white"
                >
                  {copy.secondaryTitle}
                </motion.h1>
              </motion.div>

              {/* THE SUN */}
              <motion.div
                style={{
                  boxShadow: sunShadow,
                  backgroundColor: sunColor,
                }}
                className="absolute z-20 h-56 w-56 overflow-hidden rounded-full md:h-80 md:w-80"
              >
                {/* Sun Surface Details */}
                <motion.div
                  initial={{ x: '-7%', scale: 1.42 }}
                  style={{ opacity: useTransform(scrollYProgress, [0, END_MOVEMENT - 0.05, END_MOVEMENT], [0.26, 0.14, 0]) }}
                  className="absolute inset-0 rounded-full overflow-hidden pointer-events-none select-none will-change-transform"
                  animate={
                    isMobile
                      ? undefined
                      : {
                          x: ['-7%', '7%', '-7%'],
                          scale: [1.42, 1.45, 1.42],
                        }
                  }
                  transition={
                    isMobile
                      ? undefined
                      : { duration: 12, repeat: Infinity, ease: 'linear' }
                  }
                  onContextMenu={(event) => event.preventDefault()}
                  onDragStart={(event) => event.preventDefault()}
                >
                  <Image
                    src={SUN_IMAGE_SRC}
                    alt="Sun Texture"
                    fill
                    priority
                    sizes="(min-width: 768px) 20rem, 16rem"
                    className="object-cover contrast-125 saturate-125 brightness-110"
                    draggable={false}
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </motion.div>

              {/* THE MOON */}
              <motion.div
                style={{ x: moonX, y: moonY, scale: moonScale }}
                className="absolute z-30 h-56 w-56 overflow-hidden rounded-full bg-black shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.9)] shadow-[0_0_20px_rgba(180,220,255,0.22)] md:h-80 md:w-80"
              >
                {/* The dark side of the moon (Texture) */}
                <div className="w-full h-full relative overflow-hidden rounded-full">
                  {/* Realistic Moon Image */}
                  <Image
                    src={MOON_IMAGE_SRC}
                    alt="Moon Texture"
                    fill
                    priority
                    sizes="(min-width: 768px) 20rem, 16rem"
                    className="object-cover scale-[1.35] grayscale opacity-30 contrast-125"
                    referrerPolicy="no-referrer"
                  />

                  {/* Sphere lighting (dark side / earthshine effect) */}
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(69,146,175,0.15)_0%,rgba(10,20,25,0.85)_60%,rgba(0,0,0,1)_100%)]"></div>

                  {/* Deep inner shadow to enhance 3D sphere effect */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_-20px_-20px_50px_rgba(0,0,0,1),inset_5px_5px_20px_rgba(255,255,255,0.05)]"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em]">{copy.scrollLabel}</span>
          <div className="w-[1px] h-12 bg-gray-400/50"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
