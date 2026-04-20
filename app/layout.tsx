import type {Metadata} from 'next';
import { Outfit } from 'next/font/google';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import SpaceRouteBackground from '@/components/SpaceRouteBackground';
import { absoluteUrl, getSiteSettings, siteConfig } from '@/lib/site';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const ogImage = absoluteUrl(settings.ogImagePath, settings.url);

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: settings.name,
      template: `%s`,
    },
    description: settings.description,
    applicationName: settings.name,
    authors: [{ name: settings.name, url: settings.url }],
    creator: settings.name,
    publisher: settings.name,
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
      icon: [{ url: settings.faviconPath, type: 'image/png' }],
      shortcut: [{ url: settings.faviconPath, type: 'image/png' }],
      apple: [{ url: settings.faviconPath, type: 'image/png' }],
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      alternateLocale: ['en_US'],
      url: '/',
      siteName: settings.name,
      title: settings.name,
      description: settings.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: settings.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.name,
      description: settings.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: settings.name,
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
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  const settingsPromise = getSiteSettings();

  return <RootLayoutContent settingsPromise={settingsPromise}>{children}</RootLayoutContent>;
}

async function RootLayoutContent({
  children,
  settingsPromise,
}: {
  children: React.ReactNode;
  settingsPromise: Promise<Awaited<ReturnType<typeof getSiteSettings>>>;
}) {
  const settings = await settingsPromise;
  const organizationJsonLd = {
    '@type': 'Organization',
    name: settings.name,
    url: settings.url,
    logo: absoluteUrl(settings.logoImagePath, settings.url),
    email: settings.email,
    telephone: settings.phone,
    description: settings.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.streetAddress,
      postalCode: settings.address.postalCode,
      addressLocality: settings.address.addressLocality,
      addressRegion: settings.address.addressRegion,
      addressCountry: settings.address.addressCountry,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: settings.email,
        telephone: settings.phone,
        areaServed: 'TR',
        availableLanguage: ['tr', 'en'],
      },
    ],
  };

  const websiteJsonLd = {
    '@type': 'WebSite',
    name: settings.name,
    url: settings.url,
    inLanguage: ['tr-TR', 'en-US'],
    description: settings.description,
    publisher: {
      '@type': 'Organization',
      name: settings.name,
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
