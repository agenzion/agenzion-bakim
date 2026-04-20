import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronLeft, Share2, User } from 'lucide-react';

import type { ContentItem } from '@/lib/db';
import { getSafeImageSrc, isRemoteImageSrc } from '@/lib/image';
import { type Locale, getLocalizedPath } from '@/lib/i18n';

interface BlogPostDetailProps {
  post: ContentItem;
  locale: Locale;
  copy: {
    shareLabel: string;
    backLabel: string;
    allPostsLabel: string;
    tagsLabel: string;
    categoryFallback: string;
    shortReadLabel: string;
    readSuffix: string;
    unspecifiedDate: string;
    noImage: string;
    teamLabel: string;
    authorFallback: string;
    nextArticleLabel: string;
  };
  nextPostTitle?: string | null;
}

function formatBlogDate(date: string | undefined, locale: Locale, fallback: string) {
  if (!date) {
    return fallback;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPostDetail({
  post,
  locale,
  copy,
  nextPostTitle,
}: BlogPostDetailProps) {
  const blogHref = getLocalizedPath(locale, 'blog');
  const authorName = post.author?.name || copy.teamLabel;
  const authorImageSrc = getSafeImageSrc(post.author?.image);
  const postImageSrc = getSafeImageSrc(post.image);

  return (
    <article className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-32 text-white">
      <div className="mb-12 flex items-center justify-between gap-6">
        <Link
          href={blogHref}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-mono uppercase tracking-wider text-white/55 backdrop-blur-xl transition-all hover:border-white/20 hover:text-white"
        >
          <ChevronLeft size={16} />
          {copy.backLabel}
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={copy.shareLabel}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white hover:text-[#020205]"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <header className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full border border-orange-300/20 bg-orange-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-100">
            {post.category || copy.categoryFallback}
          </span>
          <span className="text-xs font-mono uppercase tracking-tighter text-white/40">
            {post.readingTime || copy.shortReadLabel} {copy.readSuffix}
          </span>
        </div>

        <h1 className="brand-font mb-8 text-5xl leading-[0.9] font-black tracking-tighter md:text-7xl">
          {post.title}
        </h1>

        <p className="mb-12 text-xl leading-relaxed font-medium text-white/68 md:text-2xl">
          {post.description}
        </p>

        <div className="flex flex-wrap items-center gap-8 border-y border-white/10 py-8">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/10">
              {authorImageSrc ? (
                <Image
                  src={authorImageSrc}
                  alt={authorName}
                  fill
                  sizes="48px"
                  unoptimized={isRemoteImageSrc(authorImageSrc)}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5">
                  <User size={24} className="text-white/45" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-bold">{authorName}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">
                {post.author?.role || copy.authorFallback}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <Calendar size={16} />
            <span>{formatBlogDate(post.date, locale, copy.unspecifiedDate)}</span>
          </div>
        </div>
      </header>

      <div className="relative mb-16 aspect-[16/9] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/35">
        {postImageSrc ? (
          <Image
            src={postImageSrc}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1024px) 896px, calc(100vw - 48px)"
            unoptimized={isRemoteImageSrc(postImageSrc)}
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <span className="text-white/45">{copy.noImage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_200px]">
        <div
          className="prose prose-xl prose-invert max-w-none
            prose-headings:brand-font prose-headings:leading-none prose-headings:tracking-tighter prose-headings:text-white
            prose-h2:mt-16 prose-h2:mb-8 prose-h2:text-4xl
            prose-p:text-lg prose-p:leading-relaxed prose-p:text-white/78
            prose-a:text-orange-200
            prose-strong:text-white
            prose-blockquote:my-12 prose-blockquote:border-l-4 prose-blockquote:border-orange-300/70 prose-blockquote:py-4 prose-blockquote:text-2xl prose-blockquote:text-white prose-blockquote:italic
            prose-ul:list-disc prose-ul:pl-6
            prose-li:mb-2 prose-li:text-lg prose-li:text-white/76"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        <aside className="space-y-12">
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-white/30">
              {copy.tagsLabel}
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/82 backdrop-blur-xl transition-colors hover:bg-white hover:text-[#020205]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest">
              {copy.shareLabel}
            </h3>
            <div className="flex gap-4">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white hover:text-[#020205]"
              >
                <span className="text-[10px] font-bold">TW</span>
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white hover:text-[#020205]"
              >
                <span className="text-[10px] font-bold">LI</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      <footer className="mt-24 border-t border-white/10 pt-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/30">
              {copy.nextArticleLabel}
            </div>
            <h4 className="cursor-pointer text-2xl font-bold hover:underline">
              {nextPostTitle || post.title}
            </h4>
          </div>
          <Link
            href={blogHref}
            className="rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#020205] transition-transform hover:scale-105"
          >
            {copy.allPostsLabel}
          </Link>
        </div>
      </footer>
    </article>
  );
}
