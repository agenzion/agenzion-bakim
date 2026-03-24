'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
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
      className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-8 text-white mix-blend-difference transition-colors duration-300"
    >
        <Link href={getLocalizedPath(locale, 'home')} className="block">
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
          <LanguageSwitch locale={locale} href={alternatePath} />
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitch locale={locale} href={alternatePath} className="h-9 min-w-9 px-2.5" />
          <MobileMenu color="white" locale={locale} copy={copy} />
        </div>
    </motion.nav>
  );
};

export default Navbar;
