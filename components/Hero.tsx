'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from './MobileMenu';
import BrandLogo from './BrandLogo';
import LanguageSwitch from './LanguageSwitch';
import type { NavigationCopy } from './navigation';
import { type Locale, getLocalizedPath } from '@/lib/i18n';

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

  // Tall container for scroll runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // --- TIMING CONFIGURATION ---
  const END_MOVEMENT = 0.7;
  const TEXT_FADE_START = 0.7;
  const TEXT_FADE_END = 0.8;

  // BACKGROUND INTERPOLATION
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.5, END_MOVEMENT],
    ['#F5F5F3', '#000000']
  );

  // TEXT TRANSITIONS
  const text1Opacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);
  const text1Y = useTransform(scrollYProgress, [0.4, 0.5], [0, -50]);
  const text1Scale = useTransform(scrollYProgress, [0.4, 0.5], [1, 0.9]);

  // Phase 2 (Eclipse/Dark mode text)
  const text2Opacity = useTransform(scrollYProgress, [TEXT_FADE_START, TEXT_FADE_END], [0, 1]);
  const text2Y = useTransform(scrollYProgress, [TEXT_FADE_START, TEXT_FADE_END], [50, 0]);

  // --- CELESTIAL ANIMATIONS ---
  const moonX = useTransform(scrollYProgress, [0, END_MOVEMENT], ['40vw', '0vw']);
  const moonY = useTransform(scrollYProgress, [0, END_MOVEMENT], ['20vh', '0vh']);
  const moonScale = useTransform(scrollYProgress, [0, END_MOVEMENT], [0.8, 1.01]);
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
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50">
          <Link href={getLocalizedPath(locale, 'home')} className="block">
            <BrandLogo
              darkOpacity={darkLogoOpacity}
              lightOpacity={lightLogoOpacity}
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href={getLocalizedPath(locale, 'about')}>
              <motion.span style={{ color: navColor }} className="text-sm font-medium">{navigation.about}</motion.span>
            </Link>
            <Link href={getLocalizedPath(locale, 'blog')}>
              <motion.span style={{ color: navColor }} className="text-sm font-medium">{navigation.blog}</motion.span>
            </Link>
            <Link href={getLocalizedPath(locale, 'contact')}>
              <motion.span style={{ color: navColor }} className="text-sm font-medium">{navigation.contact}</motion.span>
            </Link>
            <LanguageSwitch locale={locale} href={alternatePath} />
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <LanguageSwitch locale={locale} href={alternatePath} className="h-9 min-w-9 px-2.5" />
            <MobileMenu color={navColor} locale={locale} copy={navigation} />
          </div>
      </nav>

      {/* Sticky Viewport */}
      <motion.div
        style={{ backgroundColor }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center z-10 transition-colors duration-0"
      >
        <div className="max-w-7xl mx-auto w-full px-8 md:px-24 flex flex-col md:flex-row items-center justify-center md:justify-between">
          {/* Text Content */}
          <div className="absolute md:relative z-40 w-full md:w-1/2 flex items-center justify-center md:justify-start pointer-events-none">
            <div className="relative w-full h-[200px] md:h-[400px] flex items-center justify-center md:justify-start">
              {/* --- TEXT PHASE 1 --- */}
              <motion.div
                style={{ opacity: text1Opacity, y: text1Y, scale: text1Scale }}
                className="absolute z-40 text-center md:text-left w-full"
              >
                <h1 className="text-5xl md:text-8xl font-extrabold text-gray-900 tracking-tighter logo-font break-words">
                  {copy.primaryTitle}
                </h1>
              </motion.div>

              {/* --- TEXT PHASE 2 (TOTALITY) --- */}
              <motion.div
                style={{ opacity: text2Opacity, y: text2Y }}
                className="absolute z-40 text-center md:text-left mix-blend-screen w-full"
              >
                <h1
                  className="text-4xl md:text-7xl font-extrabold text-white tracking-tight logo-font"
                  style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}
                >
                  {copy.secondaryTitle}
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Celestial System */}
          <div className="relative w-full md:w-1/2 flex items-center justify-center md:justify-end">
            <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
          {/* THE SUN */}
          <motion.div
            style={{
              boxShadow: sunShadow,
              backgroundColor: sunColor,
            }}
            className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full z-20 overflow-hidden"
          >
            {/* Sun Surface Details */}
            <motion.div 
              initial={{ x: '-7%', scale: 1.42 }}
              style={{ opacity: useTransform(scrollYProgress, [0, END_MOVEMENT - 0.05, END_MOVEMENT], [0.26, 0.14, 0]) }}
              className="absolute inset-0 rounded-full overflow-hidden pointer-events-none select-none will-change-transform"
              animate={{
                x: ['-7%', '7%', '-7%'],
                scale: [1.42, 1.45, 1.42],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
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
            className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full z-30 overflow-hidden shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.9)] shadow-[0_0_20px_rgba(180,220,255,0.22)] bg-black"
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
