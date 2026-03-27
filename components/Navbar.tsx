'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import MobileMenu from './MobileMenu';
import BrandLogo from './BrandLogo';
import LanguageSwitch from './LanguageSwitch';
import type { NavigationProps } from './navigation';
import { getLocalizedPath } from '@/lib/i18n';

const Navbar: React.FC<
  {
    dark?: boolean;
  } & NavigationProps
> = ({ dark = false, locale, alternatePath, copy }) => {
  const { scrollY } = useScroll();
  const [isDarkBackground, setIsDarkBackground] = React.useState(dark);
  
  // Background opacity starts at 0 and goes to 0.8 after 100px scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']
  );

  // Backdrop blur starts at 0 and goes to 12px after 100px scroll
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(12px)']
  );

  // Padding decreases as we scroll
  const padding = useTransform(
    scrollY,
    [0, 100],
    ['32px', '16px']
  );

  // Border bottom opacity
  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.1)']
  );

  const darkLogoOpacity = useTransform(
    scrollY,
    [0, 100],
    [dark ? 0 : 1, 0]
  );

  const lightLogoOpacity = useTransform(
    scrollY,
    [0, 100],
    [dark ? 1 : 0, 1]
  );

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsDarkBackground(dark || latest > 8);
  });

  return (
    <motion.nav 
      style={{ 
        backgroundColor,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
        paddingTop: padding,
        paddingBottom: padding,
        borderBottom: `1px solid`,
        borderBottomColor: borderOpacity,
      }}
      className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-5 text-white mix-blend-difference transition-colors duration-300 md:px-8"
    >
        <Link href={getLocalizedPath(locale, 'home')} className="block shrink-0">
          <BrandLogo
            darkOpacity={darkLogoOpacity}
            lightOpacity={lightLogoOpacity}
            priority
          />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href={getLocalizedPath(locale, 'about')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            {copy.about}
          </Link>
          <Link
            href={getLocalizedPath(locale, 'blog')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            {copy.blog}
          </Link>
          <Link
            href={getLocalizedPath(locale, 'contact')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            {copy.contact}
          </Link>
          <span
            aria-hidden="true"
            className="h-4 w-px bg-current/25 mix-blend-normal"
          />
          <LanguageSwitch locale={locale} href={alternatePath} dark={isDarkBackground} />
        </div>
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <LanguageSwitch
            locale={locale}
            href={alternatePath}
            dark={isDarkBackground}
            className="text-sm"
          />
          <MobileMenu color="white" locale={locale} copy={copy} />
        </div>
    </motion.nav>
  );
};

export default Navbar;
