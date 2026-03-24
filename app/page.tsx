import type { Metadata } from 'next';

import About from '@/components/About';
import CodeEditor from '@/components/CodeEditor';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Showcase from '@/components/Showcase';
import { buildLocalizedMetadata, buildWebPageJsonLd } from '@/lib/seo';
import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('tr');

export const metadata: Metadata = buildLocalizedMetadata({
  locale: 'tr',
  title: content.meta.homeTitle,
  description: content.meta.homeDescription,
  currentPath: '/',
  trPath: '/',
  enPath: '/en',
});

export default function Home() {
  const jsonLd = buildWebPageJsonLd({
    locale: 'tr',
    title: content.meta.homeTitle,
    description: content.meta.homeDescription,
    path: '/',
  });

  return (
    <main lang="tr" className="w-full min-h-screen bg-[#F5F5F3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        locale="tr"
        alternatePath="/en"
        copy={content.hero}
        navigation={content.navigation}
      />
      <div className="bg-black">
        <About paragraphs={content.about.paragraphs} />
        <Services heading={content.services.heading} services={content.services.items} />
      </div>
      <div className="bg-neutral-950">
        <Showcase
          heading={content.showcase.heading}
          voyagerLabel={content.showcase.voyagerLabel}
          projects={content.showcase.projects}
        />
        <CodeEditor copy={content.codeEditor} />
        <Contact copy={content.contact} showMap={false} />
        <Footer copy={content.footer} />
      </div>
    </main>
  );
}
