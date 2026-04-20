import type {Metadata} from 'next';
import { Outfit } from 'next/font/google';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import SpaceRouteBackground from '@/components/SpaceRouteBackground';
import { absoluteUrl, siteConfig } from '@/lib/site';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'technology',
  keywords: [
    'web tasarım',
    'web geliştirme',
    'performans optimizasyonu',
    'seo',
    'yaratıcı web stüdyosu',
    'İstanbul web stüdyosu',
    'next.js',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/',
      'en-US': '/en',
      'x-default': '/',
    },
  },
  icons: {
    icon: [{ url: siteConfig.favicon, type: 'image/png' }],
    shortcut: [{ url: siteConfig.favicon, type: 'image/png' }],
    apple: [{ url: siteConfig.favicon, type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    alternateLocale: ['en_US'],
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const organizationJsonLd = {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logoImage),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.streetAddress,
      postalCode: siteConfig.address.postalCode,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      addressCountry: siteConfig.address.addressCountry,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: siteConfig.email,
        telephone: siteConfig.phone,
        areaServed: 'TR',
        availableLanguage: ['tr', 'en'],
      },
    ],
  };

  const websiteJsonLd = {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: ['tr-TR', 'en-US'],
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };

  const rootJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [organizationJsonLd, websiteJsonLd],
  };

  return (
    <html lang="tr" className={`${outfit.variable}`}>
      <body suppressHydrationWarning className="relative isolate font-sans antialiased bg-[#F5F5F3] selection:bg-black selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootJsonLd),
          }}
        />
        <SpaceRouteBackground />
        <div className="relative z-10">
          {children}
        </div>
        <ScrollToTopButton />
      </body>
    </html>
  );
}
