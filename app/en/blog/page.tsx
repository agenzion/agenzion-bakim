import BlogIndexPage from '@/components/BlogIndexPage';
import { getLocalizedBlogPosts } from '@/lib/content';
import { buildWebPageJsonLd } from '@/lib/seo';
import { getSiteSettings } from '@/lib/site';
import { getLocaleContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function EnglishBlogPage() {
  const [content, blog, settings] = await Promise.all([
    getLocaleContent('en'),
    getLocalizedBlogPosts('en'),
    getSiteSettings(),
  ]);
  const jsonLd = buildWebPageJsonLd({
    locale: 'en',
    title: content.meta.blogTitle,
    description: content.meta.blogDescription,
    path: '/en/blog',
    type: 'CollectionPage',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogIndexPage
        locale="en"
        alternatePath="/blog"
        navigation={content.navigation}
        footer={content.footer}
        socialLinks={settings.socialLinks}
        blogCopy={content.blog}
        blog={blog}
      />
    </>
  );
}
