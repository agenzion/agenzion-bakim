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

const content = getLocaleContent('en');

export const metadata: Metadata = buildLocalizedMetadata({
  locale: 'en',
  title: content.meta.homeTitle,
  description: content.meta.homeDescription,
  currentPath: '/en',
  trPath: '/',
  enPath: '/en',
});

export default function EnglishHome() {
  const jsonLd = buildWebPageJsonLd({
    locale: 'en',
    title: content.meta.homeTitle,
    description: content.meta.homeDescription,
    path: '/en',
  });

  return (
    <main lang="en" className="w-full min-h-screen bg-[#F5F5F3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        locale="en"
        alternatePath="/"
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
