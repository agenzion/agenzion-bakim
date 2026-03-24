import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import StarTextManifesto from '@/components/StarTextManifesto';
import { buildLocalizedMetadata, buildWebPageJsonLd } from '@/lib/seo';
import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('tr');

export const metadata: Metadata = buildLocalizedMetadata({
  locale: 'tr',
  title: content.meta.aboutTitle,
  description: content.meta.aboutDescription,
  currentPath: '/hakkimizda',
  trPath: '/hakkimizda',
  enPath: '/en/about',
});

export default function AboutPage() {
  const jsonLd = buildWebPageJsonLd({
    locale: 'tr',
    title: content.meta.aboutTitle,
    description: content.meta.aboutDescription,
    path: '/hakkimizda',
    type: 'AboutPage',
  });

  return (
    <main lang="tr" className="relative min-h-screen bg-transparent text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar dark locale="tr" alternatePath="/en/about" copy={content.navigation} />
      <div className="relative z-10">
        <StarTextManifesto
          sections={content.aboutManifesto.sections}
          indicatorLabel={content.aboutManifesto.indicatorLabel}
          footerCopy={content.footer}
        />
      </div>
    </main>
  );
}
