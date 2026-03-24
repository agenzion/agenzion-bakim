export const siteConfig = {
  name: 'Agenzion Web Studio',
  url: 'https://agenzion.com',
  locale: 'tr_TR',
  ogImage: '/images/logo-acik.png',
  description:
    'Agenzion; performans, SEO ve yaratıcı etkileşimi birlikte ele alan Istanbul merkezli butik web tasarım ve geliştirme stüdyosudur.',
  email: 'info@agenzion.com',
  phone: '+905404553444',
  address: {
    streetAddress: 'Ataköy 7-8-9-10. Kısım Mah. Çobançeşme E-5, Yan Yol No: 14/A, İKÜ TEKMER',
    postalCode: '34158',
    addressLocality: 'Bakırköy',
    addressRegion: 'İstanbul',
    addressCountry: 'TR',
  },
} as const;

export const staticRoutes = [
  '/',
  '/hakkimizda',
  '/blog',
  '/iletisim',
  '/en',
  '/en/about',
  '/en/blog',
  '/en/contact',
] as const;

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}
