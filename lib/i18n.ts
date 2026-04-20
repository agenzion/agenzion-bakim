export const locales = ['tr', 'en'] as const;

export type Locale = (typeof locales)[number];

export type RouteKey = 'home' | 'blog';

const routeSegments = {
  blog: {
    tr: 'blog',
    en: 'blog',
  },
} as const;

const localePrefix = {
  tr: '',
  en: '/en',
} as const;

export const defaultLocale: Locale = 'tr';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalizedPath(locale: Locale, route: RouteKey): string {
  const prefix = localePrefix[locale];

  if (route === 'home') {
    return prefix || '/';
  }

  const segment = routeSegments[route][locale];
  return `${prefix}/${segment}`;
}

export function getLocalizedBlogPostPath(locale: Locale, slug: string): string {
  return `${getLocalizedPath(locale, 'blog')}/${slug}`;
}

export function stripTrailingSlash(pathname: string) {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function stripLocalePrefix(pathname: string) {
  const normalized = stripTrailingSlash(pathname);

  if (normalized === '/en') {
    return '/';
  }

  if (normalized.startsWith('/en/')) {
    return normalized.slice(3) || '/';
  }

  return normalized || '/';
}

export function getLocaleFromPathname(pathname: string): Locale {
  const normalized = stripTrailingSlash(pathname);
  return normalized === '/en' || normalized.startsWith('/en/') ? 'en' : 'tr';
}

export function normalizePublicPathname(pathname: string) {
  const path = stripLocalePrefix(pathname);

  if (path === '/' || path === '') {
    return '/';
  }

  if (path === '/blog' || path.startsWith('/blog/')) {
    return '/blog';
  }

  return path;
}

export function slugify(value: string) {
  return value
    .toLocaleLowerCase('en-US')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}
