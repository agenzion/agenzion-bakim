import type { Locale } from '@/lib/i18n';

export interface NavigationCopy {
  about: string;
  blog: string;
  contact: string;
  openMenu: string;
  closeMenu: string;
  socialLabel: string;
  socialLinks: readonly string[];
  mobileCopyright: string;
}

export interface NavigationProps {
  locale: Locale;
  alternatePath: string;
  copy: NavigationCopy;
}
