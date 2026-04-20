import type { Metadata } from 'next';
import Link from 'next/link';

import BlogPostDetail from '@/components/BlogPostDetail';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import {
  getLocalizedBlogEntry,
  getNextLocalizedBlogPostTitle,
} from '@/lib/content';
import { getLocalizedPath } from '@/lib/i18n';
import { buildLocalizedMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';
import { getLocaleContent } from '@/lib/site-content';

interface Props {
  params: Promise<{ slug: string }>;
}

const content = getLocaleContent('en');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getLocalizedBlogEntry('en', slug);
  const post = entry?.localizations.en || null;

  if (!post) {
    return buildLocalizedMetadata({
      locale: 'en',
      title: content.blog.postNotFoundTitle,
      description: content.meta.blogDescription,
      currentPath: `/en/blog/${slug}`,
      trPath: '/blog',
      enPath: `/en/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildLocalizedMetadata({
    locale: 'en',
    title: `${post.title} | Agenzion Blog`,
    description: post.description,
    currentPath: `/en/blog/${post.slug}`,
    trPath: entry ? `/blog/${entry.localizations.tr.slug}` : '/blog',
    enPath: `/en/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.date,
    authors: post.author?.name ? [post.author.name] : undefined,
    tags: post.tags,
  });
}

export default async function EnglishBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getLocalizedBlogEntry('en', slug);
  const post = entry?.localizations.en || null;

  if (!post) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-transparent text-white">
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-4xl font-bold">{content.blog.postNotFoundTitle}</h1>
          <Link href={getLocalizedPath('en', 'blog')} className="text-white/70 hover:underline">
            {content.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  const nextPostTitle = await getNextLocalizedBlogPostTitle('en', post.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role,
        }
      : {
          '@type': 'Organization',
          name: 'Agenzion Web Studio',
        },
    publisher: {
      '@type': 'Organization',
      name: 'Agenzion Web Studio',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/logo-koyu.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/en/blog/${post.slug}`),
    },
    url: absoluteUrl(`/en/blog/${post.slug}`),
    inLanguage: 'en-US',
    keywords: post.tags?.join(', '),
    isPartOf: {
      '@type': 'Blog',
      name: 'Agenzion Blog',
      url: absoluteUrl('/en/blog'),
    },
    potentialAction: entry
      ? {
          '@type': 'ReadAction',
          target: absoluteUrl(`/blog/${entry?.localizations.tr.slug}`),
        }
      : undefined,
  };

  return (
    <main lang="en" className="relative min-h-screen overflow-hidden bg-transparent text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative z-10">
        <Navbar
          dark
          locale="en"
          alternatePath={entry ? `/blog/${entry.localizations.tr.slug}` : '/blog'}
          copy={content.navigation}
        />
        <BlogPostDetail
          post={post}
          locale="en"
          copy={content.blog}
          nextPostTitle={nextPostTitle}
        />
        <Footer copy={content.footer} />
      </div>
    </main>
  );
}
