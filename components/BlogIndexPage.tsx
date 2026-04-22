'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

import type { ContentItem } from '@/lib/db';
import { getSafeImageSrc, isRemoteImageSrc } from '@/lib/image';
import { getLocalizedBlogPostPath, type Locale } from '@/lib/i18n';
import type { FooterSocialLink } from '@/lib/site';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import type { NavigationCopy } from '@/components/navigation';

export default function BlogIndexPage({
  locale,
  alternatePath,
  navigation,
  footer,
  socialLinks,
  blogCopy,
  blog,
}: {
  locale: Locale;
  alternatePath: string;
  navigation: NavigationCopy;
  footer: {
    copyrightName: string;
  };
  socialLinks?: FooterSocialLink[];
  blogCopy: {
    title: string;
    description: string;
    loading: string;
    emptyDate: string;
    categoryFallback: string;
    shareLabel: string;
    backLabel: string;
    allPostsLabel: string;
    tagsLabel: string;
    shortReadLabel: string;
    readSuffix: string;
    unspecifiedDate: string;
    noImage: string;
    teamLabel: string;
    authorFallback: string;
    nextArticleLabel: string;
  };
  blog: ContentItem[];
}) {
  return (
    <main lang={locale} className="relative min-h-screen overflow-hidden bg-transparent text-white">
      <Navbar dark locale={locale} alternatePath={alternatePath} copy={navigation} />
      <div className="relative z-10 px-6 pt-40 pb-20 md:px-8 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 brand-font"
        >
          {blogCopy.title}
        </motion.h1>
        <p className="max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed mb-14">
          {blogCopy.description}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
          {blog.map((item) => {
            const imageSrc = getSafeImageSrc(item.image);
            const isRemoteImage = isRemoteImageSrc(imageSrc);

            return (
              <Link
                key={item.id}
                href={getLocalizedBlogPostPath(locale, item.slug || item.id)}
                className="group block h-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#070711]"
              >
                <article className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                  <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-white/10">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        unoptimized={isRemoteImage}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/45">
                        {blogCopy.noImage}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 flex items-center gap-4 text-sm font-mono text-white/45">
                    <span>
                      {(() => {
                        if (!item.date) return blogCopy.emptyDate;
                        const date = new Date(item.date);
                        if (Number.isNaN(date.getTime())) {
                          return item.date.toUpperCase();
                        }

                        return date
                          .toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                          .toUpperCase();
                      })()}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/25"></span>
                    <span className="text-white/60">
                      {(item.category || blogCopy.categoryFallback).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="mb-4 text-3xl md:text-4xl font-bold leading-tight text-white group-hover:underline decoration-white/60 decoration-2 underline-offset-8">
                    {item.title}
                  </h2>
                  <p className="mt-auto text-base md:text-lg leading-relaxed text-white/68">
                    {item.description}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer copy={footer} socialLinks={socialLinks} />
    </main>
  );
}
