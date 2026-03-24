import type { Metadata } from 'next';

import { buildLocalizedMetadata } from '@/lib/seo';
import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('tr');

export const metadata: Metadata = buildLocalizedMetadata({
  locale: 'tr',
  title: content.meta.blogTitle,
  description: content.meta.blogDescription,
  currentPath: '/blog',
  trPath: '/blog',
  enPath: '/en/blog',
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
