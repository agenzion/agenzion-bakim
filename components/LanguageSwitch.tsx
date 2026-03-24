'use client';

import Link from 'next/link';

import type { Locale } from '@/lib/i18n';

interface LanguageSwitchProps {
  locale: Locale;
  href: string;
  className?: string;
}

export default function LanguageSwitch({
  locale,
  href,
  className = '',
}: LanguageSwitchProps) {
  const nextLocale = locale === 'tr' ? 'EN' : 'TR';

  return (
    <Link
      href={href}
      aria-label={`Switch language to ${nextLocale}`}
      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold tracking-[0.2em] text-white transition-colors hover:bg-white/10 ${className}`.trim()}
    >
      {nextLocale}
    </Link>
  );
}
