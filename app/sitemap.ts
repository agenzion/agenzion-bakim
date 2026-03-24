import type { MetadataRoute } from 'next';
import { getLocalizedBlogPosts } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

const fallbackDate = new Date();

const parseDate = (value?: string) => {
  if (!value) {
    return fallbackDate;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallbackDate : date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trBlogPosts = await getLocalizedBlogPosts('tr');
  const enBlogPosts = await getLocalizedBlogPosts('en');

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: fallbackDate,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          'tr-TR': absoluteUrl('/'),
          'en-US': absoluteUrl('/en'),
        },
      },
    },
    {
      url: absoluteUrl('/hakkimizda'),
      lastModified: fallbackDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'tr-TR': absoluteUrl('/hakkimizda'),
          'en-US': absoluteUrl('/en/about'),
        },
      },
    },
    {
      url: absoluteUrl('/blog'),
      lastModified: fallbackDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'tr-TR': absoluteUrl('/blog'),
          'en-US': absoluteUrl('/en/blog'),
        },
      },
    },
    {
      url: absoluteUrl('/iletisim'),
      lastModified: fallbackDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'tr-TR': absoluteUrl('/iletisim'),
          'en-US': absoluteUrl('/en/contact'),
        },
      },
    },
    {
      url: absoluteUrl('/en'),
      lastModified: fallbackDate,
      changeFrequency: 'weekly',
      priority: 0.86,
      alternates: {
        languages: {
          'tr-TR': absoluteUrl('/'),
          'en-US': absoluteUrl('/en'),
        },
      },
    },
    {
      url: absoluteUrl('/en/about'),
      lastModified: fallbackDate,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          'tr-TR': absoluteUrl('/hakkimizda'),
          'en-US': absoluteUrl('/en/about'),
        },
      },
    },
    {
      url: absoluteUrl('/en/blog'),
      lastModified: fallbackDate,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          'tr-TR': absoluteUrl('/blog'),
          'en-US': absoluteUrl('/en/blog'),
        },
      },
    },
    {
      url: absoluteUrl('/en/contact'),
      lastModified: fallbackDate,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          'tr-TR': absoluteUrl('/iletisim'),
          'en-US': absoluteUrl('/en/contact'),
        },
      },
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = trBlogPosts.map((post, index) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: parseDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.64,
    alternates: {
      languages: {
        'tr-TR': absoluteUrl(`/blog/${post.slug}`),
        'en-US': absoluteUrl(`/en/blog/${enBlogPosts[index]?.slug || post.slug}`),
      },
    },
  }));

  const englishBlogEntries: MetadataRoute.Sitemap = enBlogPosts.map((post, index) => ({
    url: absoluteUrl(`/en/blog/${post.slug}`),
    lastModified: parseDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.56,
    alternates: {
      languages: {
        'tr-TR': absoluteUrl(`/blog/${trBlogPosts[index]?.slug || post.slug}`),
        'en-US': absoluteUrl(`/en/blog/${post.slug}`),
      },
    },
  }));

  return [...staticEntries, ...blogEntries, ...englishBlogEntries];
}
