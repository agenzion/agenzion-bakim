'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';

import type { ContentItem } from '@/lib/db';
import type { Locale } from '@/lib/i18n';
import BlogPostDetail from '@/components/BlogPostDetail';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import {
  RabbitHoleTransition,
  type ClickPosition,
} from '@/components/RabbitHoleTransition';
import type { NavigationCopy } from '@/components/navigation';

export default function BlogIndexPage({
  locale,
  alternatePath,
  navigation,
  footer,
  blogCopy,
}: {
  locale: Locale;
  alternatePath: string;
  navigation: NavigationCopy;
  footer: {
    copyrightName: string;
  };
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
}) {
  const [blog, setBlog] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<ContentItem | null>(null);
  const [clickPos, setClickPos] = useState<ClickPosition>({ x: 0, y: 0 });

  useEffect(() => {
    fetch(`/api/content?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data.blog || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [locale]);

  const handleBlogClick = (
    item: ContentItem,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setClickPos({ x: event.clientX, y: event.clientY });
    setSelectedBlog(item);
  };

  const currentPostIndex = selectedBlog
    ? blog.findIndex((item) => item.id === selectedBlog.id)
    : -1;
  const nextPostTitle =
    currentPostIndex >= 0 ? blog[(currentPostIndex + 1) % blog.length]?.title : null;

  return (
    <main lang={locale} className="relative min-h-screen overflow-hidden bg-transparent text-white">
      <Navbar dark locale={locale} alternatePath={alternatePath} copy={navigation} />
      <div className="relative z-10 pt-40 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
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

        {loading ? (
          <div className="py-20 text-center text-white/45">{blogCopy.loading}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
            {blog.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={(event) => handleBlogClick(item, event)}
                className="group block h-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#070711]"
              >
                <article className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                  <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-white/10">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
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
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer copy={footer} />

      <AnimatePresence>
        {selectedBlog ? (
          <RabbitHoleTransition
            key={selectedBlog.id}
            isOpen={Boolean(selectedBlog)}
            clickPos={clickPos}
          >
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#020205] via-[#0a0a1a] to-[#020205] text-white">
              <BlogPostDetail
                post={selectedBlog}
                locale={locale}
                copy={blogCopy}
                nextPostTitle={nextPostTitle}
                onClose={() => setSelectedBlog(null)}
              />
            </div>
          </RabbitHoleTransition>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
