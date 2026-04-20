import type { Metadata } from 'next';

import { absoluteUrl, siteConfig } from '@/lib/site';
import { type Locale } from '@/lib/i18n';
import { localeMeta } from '@/lib/site-content';

function toAbsoluteImage(url: string) {
  return url.startsWith('http') ? url : absoluteUrl(url);
}

export function buildLocalizedMetadata({
  locale,
  title,
  description,
  currentPath,
  trPath,
  enPath,
  type = 'website',
  images = [siteConfig.ogImage],
  publishedTime,
  authors,
  tags,
  noIndex = false,
}: {
  locale: Locale;
  title: string;
  description: string;
  currentPath: string;
  trPath: string;
  enPath: string;
  type?: 'website' | 'article';
  images?: string[];
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}): Metadata {
  const currentLocale = localeMeta[locale];
  const alternateLocale = locale === 'tr' ? localeMeta.en.openGraphLocale : localeMeta.tr.openGraphLocale;
  const absoluteImages = images.map((image) => {
    const url = toAbsoluteImage(image);

    return image === siteConfig.ogImage
      ? {
          url,
          width: 1200,
          height: 630,
          alt: title,
        }
      : {
          url,
          alt: title,
        };
  });

  return {
    title,
    description,
    alternates: {
      canonical: currentPath,
      languages: {
        'tr-TR': trPath,
        'en-US': enPath,
        'x-default': trPath,
      },
    },
    openGraph: {
      type,
      locale: currentLocale.openGraphLocale,
      alternateLocale: [alternateLocale],
      url: currentPath,
      siteName: siteConfig.name,
      title,
      description,
      images: absoluteImages,
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors?.length ? { authors } : {}),
      ...(tags?.length ? { tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: absoluteImages.map((image) => image.url),
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

export function buildWebPageJsonLd({
  locale,
  title,
  description,
  path,
  type = 'WebPage',
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  type?: 'WebPage' | 'AboutPage' | 'CollectionPage' | 'ContactPage';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description,
    inLanguage: localeMeta[locale].languageTag,
    url: absoluteUrl(path),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
