import type { Metadata } from 'next';

import ContactPageView from '@/components/ContactPageView';
import { buildLocalizedMetadata, buildWebPageJsonLd } from '@/lib/seo';
import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('en');

export const metadata: Metadata = buildLocalizedMetadata({
  locale: 'en',
  title: content.meta.contactTitle,
  description: content.meta.contactDescription,
  currentPath: '/en/contact',
  trPath: '/iletisim',
  enPath: '/en/contact',
});

export default function EnglishContactPage() {
  const jsonLd = buildWebPageJsonLd({
    locale: 'en',
    title: content.meta.contactTitle,
    description: content.meta.contactDescription,
    path: '/en/contact',
    type: 'ContactPage',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPageView
        locale="en"
        alternatePath="/iletisim"
        navigation={content.navigation}
        contact={content.contact}
        footer={content.footer}
      />
    </>
  );
}
