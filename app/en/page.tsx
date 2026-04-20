import type { Metadata } from 'next';

import About from '@/components/About';
import CodeEditor from '@/components/CodeEditor';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import HeadlessCommerceSection from '@/components/HeadlessCommerceSection';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Showcase from '@/components/Showcase';
import { getHomepageShowcaseProjects } from '@/lib/content';
import { buildLocalizedMetadata, buildWebPageJsonLd } from '@/lib/seo';
import { getSiteSettings } from '@/lib/site';
import { getLocaleContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLocaleContent('en');

  return buildLocalizedMetadata({
    locale: 'en',
    title: content.meta.homeTitle,
    description: content.meta.homeDescription,
    currentPath: '/en',
    trPath: '/',
    enPath: '/en',
  });
}

export default async function EnglishHome() {
  const [content, projects, settings] = await Promise.all([
    getLocaleContent('en'),
    getHomepageShowcaseProjects('en'),
    getSiteSettings(),
  ]);
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
      <section className="relative -mt-px overflow-x-clip bg-[linear-gradient(to_bottom,#000000_0%,#000000_34%,#020205_52%,#060916_76%,#020205_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-12rem] top-[12%] h-[34rem] w-[34rem] rounded-full bg-[#4592AF]/10 blur-[160px]" />
          <div className="absolute left-[-10rem] top-[42%] h-[28rem] w-[28rem] rounded-full bg-blue-800/10 blur-[150px]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black via-black/92 to-transparent" />
        </div>
        <About paragraphs={content.about.paragraphs} />
        <Services heading={content.services.heading} services={content.services.items} />
        <HeadlessCommerceSection
          sections={content.headlessCommerce.sections}
          indicatorLabel={content.headlessCommerce.indicatorLabel}
          footerCopy={content.footer}
        />
      </section>
      <div className="bg-neutral-950">
        <Showcase
          heading={content.showcase.heading}
          voyagerLabel={content.showcase.voyagerLabel}
          reviewLabel={content.showcase.reviewLabel}
          emptyLabel={content.showcase.emptyLabel}
          projects={projects}
        />
        <CodeEditor copy={content.codeEditor} />
        <Contact copy={content.contact} showMap showMapContactLinks />
        <Footer copy={content.footer} socialLinks={settings.socialLinks} />
      </div>
    </main>
  );
}
