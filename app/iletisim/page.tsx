import type { Metadata } from 'next';

import ContactPageView from '@/components/ContactPageView';
import { buildLocalizedMetadata, buildWebPageJsonLd } from '@/lib/seo';
import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('tr');

export const metadata: Metadata = buildLocalizedMetadata({
  locale: 'tr',
  title: content.meta.contactTitle,
  description: content.meta.contactDescription,
  currentPath: '/iletisim',
  trPath: '/iletisim',
  enPath: '/en/contact',
});

export default function ContactPage() {
  const jsonLd = buildWebPageJsonLd({
    locale: 'tr',
    title: content.meta.contactTitle,
    description: content.meta.contactDescription,
    path: '/iletisim',
    type: 'ContactPage',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPageView
        locale="tr"
        alternatePath="/en/contact"
        navigation={content.navigation}
        contact={content.contact}
        footer={content.footer}
      />
    </>
  );
}
