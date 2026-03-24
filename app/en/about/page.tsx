import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import StarTextManifesto from '@/components/StarTextManifesto';
import { buildLocalizedMetadata, buildWebPageJsonLd } from '@/lib/seo';
import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('en');

export const metadata: Metadata = buildLocalizedMetadata({
  locale: 'en',
  title: content.meta.aboutTitle,
  description: content.meta.aboutDescription,
  currentPath: '/en/about',
  trPath: '/hakkimizda',
  enPath: '/en/about',
});

export default function EnglishAboutPage() {
  const jsonLd = buildWebPageJsonLd({
    locale: 'en',
    title: content.meta.aboutTitle,
    description: content.meta.aboutDescription,
    path: '/en/about',
    type: 'AboutPage',
  });

  return (
    <main lang="en" className="relative min-h-screen bg-transparent text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar dark locale="en" alternatePath="/hakkimizda" copy={content.navigation} />
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
