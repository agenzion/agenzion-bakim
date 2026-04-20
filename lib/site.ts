import { sanityFetch } from '@/lib/sanity';

export const siteConfig = {
  name: 'Agenzion Web Studio',
  url: 'https://agenzion.com',
  locale: 'tr_TR',
  logoImage: '/images/logo-koyu.png',
  ogImage: '/images/share-logo.png',
  favicon: '/favicon.png',
  description:
    'Agenzion; performans, SEO ve yaratıcı etkileşimi birlikte ele alan İstanbul merkezli butik web tasarım ve geliştirme stüdyosudur.',
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

export interface FooterSocialLink {
  title: string;
  href: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface SiteSettings {
  name: string;
  url: string;
  description: string;
  email: string;
  phone: string;
  logoImagePath: string;
  ogImagePath: string;
  faviconPath: string;
  address: typeof siteConfig.address;
  socialLinks: FooterSocialLink[];
}

const SITE_SETTINGS_QUERY = /* groq */ `
  *[_id == "siteSettings"][0]{
    name,
    url,
    description,
    email,
    phone,
    logoImagePath,
    ogImagePath,
    faviconPath,
    address,
    socialLinks[]{
      title,
      href,
      gradientFrom,
      gradientTo
    }
  }
`;

const fallbackSettings: SiteSettings = {
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.email,
  phone: siteConfig.phone,
  logoImagePath: siteConfig.logoImage,
  ogImagePath: siteConfig.ogImage,
  faviconPath: siteConfig.favicon,
  address: siteConfig.address,
  socialLinks: [
    {
      title: 'Linkedin',
      href: 'https://www.linkedin.com/company/agenzion',
      gradientFrom: '#5cb8ff',
      gradientTo: '#0a66c2',
    },
    {
      title: 'Instagram',
      href: 'https://www.instagram.com/agenzion',
      gradientFrom: '#f9ce34',
      gradientTo: '#c13584',
    },
    {
      title: 'Napolion',
      href: 'https://napolion.com.tr',
      gradientFrom: '#7cf7c3',
      gradientTo: '#0f9d8a',
    },
  ],
};

export const staticRoutes = [
  '/',
  '/blog',
  '/en',
  '/en/blog',
] as const;

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await sanityFetch<Partial<SiteSettings>>(SITE_SETTINGS_QUERY);

  return {
    ...fallbackSettings,
    ...settings,
    address: {
      ...fallbackSettings.address,
      ...settings?.address,
    },
    socialLinks: settings?.socialLinks?.length ? settings.socialLinks : fallbackSettings.socialLinks,
  };
}

export function absoluteUrl(path = '/', baseUrl: string = siteConfig.url) {
  return new URL(path, baseUrl).toString();
}
