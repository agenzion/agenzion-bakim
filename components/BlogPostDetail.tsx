import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronLeft } from 'lucide-react';

import BlogShareButton from '@/components/BlogShareButton';
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
    categoryFallback: string;
    shortReadLabel: string;
    readSuffix: string;
    unspecifiedDate: string;
    noImage: string;
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
  const postImageSrc = getSafeImageSrc(post.image);
  const formattedDate = formatBlogDate(post.date, locale, copy.unspecifiedDate);
  const tags = post.tags?.filter(Boolean) || [];

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
          <BlogShareButton label={copy.shareLabel} title={post.title} text={post.description} />
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

        <h1 className="brand-font mb-8 text-5xl leading-[0.98] font-black tracking-tighter md:text-7xl md:leading-[0.94]">
          {post.title}
        </h1>

        <p className="mb-12 text-xl leading-relaxed font-medium text-white/68 md:text-2xl">
          {post.description}
        </p>

        <div className="flex flex-col gap-5 border-y border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>

          {tags.length ? (
            <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto sm:max-w-[60%]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-left text-[11px] font-medium text-white/82 backdrop-blur-xl"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
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

      <div
        className="prose prose-xl prose-invert max-w-none
            prose-headings:font-black prose-headings:leading-tight prose-headings:tracking-normal prose-headings:text-white
            prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-3xl prose-h2:leading-[1.18] md:prose-h2:mt-16 md:prose-h2:text-[2rem]
            prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-2xl prose-h3:leading-snug md:prose-h3:text-[1.7rem]
            prose-p:my-6 prose-p:text-lg prose-p:leading-[1.85] prose-p:text-white/78
            prose-a:text-orange-200
            prose-strong:text-white
            prose-blockquote:my-12 prose-blockquote:border-l-4 prose-blockquote:border-orange-300/70 prose-blockquote:py-4 prose-blockquote:text-2xl prose-blockquote:leading-relaxed prose-blockquote:text-white prose-blockquote:italic
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-li:mb-2 prose-li:text-lg prose-li:text-white/76"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />

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
