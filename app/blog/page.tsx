import BlogIndexPage from '@/components/BlogIndexPage';
import { buildWebPageJsonLd } from '@/lib/seo';
import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('tr');

export default function BlogPage() {
  const jsonLd = buildWebPageJsonLd({
    locale: 'tr',
    title: content.meta.blogTitle,
    description: content.meta.blogDescription,
    path: '/blog',
    type: 'CollectionPage',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogIndexPage
        locale="tr"
        alternatePath="/en/blog"
        navigation={content.navigation}
        footer={content.footer}
        blogCopy={content.blog}
      />
    </>
  );
}
