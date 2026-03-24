import type { Metadata } from 'next';

import { buildLocalizedMetadata } from '@/lib/seo';
import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('en');

export const metadata: Metadata = buildLocalizedMetadata({
  locale: 'en',
  title: content.meta.blogTitle,
  description: content.meta.blogDescription,
  currentPath: '/en/blog',
  trPath: '/blog',
  enPath: '/en/blog',
});

export default function EnglishBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
