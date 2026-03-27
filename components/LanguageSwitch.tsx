'use client';

import Link from 'next/link';
import { motion, type MotionValue } from 'motion/react';

import type { Locale } from '@/lib/i18n';

interface LanguageSwitchProps {
  locale: Locale;
  href: string;
  className?: string;
  dark?: boolean;
  color?: string | MotionValue<string>;
}

export default function LanguageSwitch({
  locale,
  href,
  className = '',
  dark = false,
  color,
}: LanguageSwitchProps) {
  const nextLocale = locale === 'tr' ? 'EN' : 'TR';
  const textColorClass = color
    ? ''
    : dark
    ? 'text-white'
    : locale === 'tr'
      ? 'text-[#012169]'
      : 'text-[#E30A17]';

  return (
    <Link
      href={href}
      aria-label={`Switch language to ${nextLocale}`}
      className={`inline-flex items-center justify-center text-sm font-medium transition-opacity hover:opacity-70 ${className}`.trim()}
    >
      <motion.span
        style={color ? { color } : undefined}
        className={textColorClass}
      >
        {nextLocale}
      </motion.span>
    </Link>
  );
}
