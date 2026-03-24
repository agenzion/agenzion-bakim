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

const content = getLocaleContent('tr');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getLocalizedBlogEntry('tr', slug);
  const post = entry?.localizations.tr || null;

  if (!post) {
    return buildLocalizedMetadata({
      locale: 'tr',
      title: content.blog.postNotFoundTitle,
      description: content.meta.blogDescription,
      currentPath: `/blog/${slug}`,
      trPath: `/blog/${slug}`,
      enPath: `/en/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildLocalizedMetadata({
    locale: 'tr',
    title: `${post.title} | Agenzion Blog`,
    description: post.description,
    currentPath: `/blog/${post.slug}`,
    trPath: `/blog/${post.slug}`,
    enPath: entry ? `/en/blog/${entry.localizations.en.slug}` : '/en/blog',
    type: 'article',
    images: post.image ? [post.image] : undefined,
    publishedTime: post.date,
    authors: post.author?.name ? [post.author.name] : undefined,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getLocalizedBlogEntry('tr', slug);
  const post = entry?.localizations.tr || null;

  if (!post) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#020205] via-[#0a0a1a] to-[#020205] text-white">
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-4xl font-bold">{content.blog.postNotFoundTitle}</h1>
          <Link href={getLocalizedPath('tr', 'blog')} className="text-white/70 hover:underline">
            {content.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  const nextPostTitle = await getNextLocalizedBlogPostTitle('tr', post.slug);

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
      '@id': absoluteUrl(`/blog/${post.slug}`),
    },
    url: absoluteUrl(`/blog/${post.slug}`),
    inLanguage: 'tr-TR',
    keywords: post.tags?.join(', '),
    isPartOf: {
      '@type': 'Blog',
      name: 'Agenzion Blog',
      url: absoluteUrl('/blog'),
    },
    potentialAction: entry
      ? {
          '@type': 'ReadAction',
          target: absoluteUrl(`/en/blog/${entry?.localizations.en.slug}`),
        }
      : undefined,
  };

  return (
    <main lang="tr" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#020205] via-[#0a0a1a] to-[#020205] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative z-10">
        <Navbar
          dark
          locale="tr"
          alternatePath={entry ? `/en/blog/${entry.localizations.en.slug}` : '/en/blog'}
          copy={content.navigation}
        />
        <BlogPostDetail
          post={post}
          locale="tr"
          copy={content.blog}
          nextPostTitle={nextPostTitle}
        />
        <Footer copy={content.footer} />
      </div>
    </main>
  );
}
