import type { AppData, ContentItem } from '@/lib/db';
import { getDb } from '@/lib/db';
import { type Locale, slugify } from '@/lib/i18n';

export interface ShowcaseProject {
  id: string;
  title: string;
  label: string;
  description: string;
  img: string;
  color: string;
  reviewUrl?: string;
}

type LocalizedBlogPost = ContentItem & { slug: string };

const showcaseColorPalette = ['#06b6d4', '#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b'];

const blogTranslations: Record<
  string,
  Partial<Record<Locale, Partial<ContentItem>>>
> = {
  'placeholder-blog': {
    en: {
      slug: 'sanity-content-coming-soon',
      title: 'Sanity Content Coming Soon',
      description:
        'Blog posts will be published here after the Sanity CMS integration is complete.',
      content:
        '<p>Once the Sanity CMS connection is ready, Agenzion blog content will be managed and published from there.</p>',
      category: 'Announcement',
      readingTime: '1 min',
      author: {
        name: 'Agenzion',
        role: 'Web Studio',
        image: '/images/logo-koyu.png',
      },
    },
  },
};

const projectTranslations: Record<
  string,
  Partial<Record<Locale, Partial<ContentItem>>>
> = {
  'placeholder-project': {
    en: {
      title: 'Projects Coming Soon',
      description:
        'Selected work and detailed project stories will appear here after the Sanity CMS integration is complete.',
      label: 'Sanity CMS',
    },
  },
};

function ensureSlug(value?: string, fallback?: string) {
  if (value && value.trim()) {
    return value;
  }

  return slugify(fallback || 'post');
}

function getDefaultProjectLabel(locale: Locale) {
  return locale === 'en' ? 'Project' : 'Proje';
}

function normalizeShowcaseProject(
  project: Partial<ContentItem>,
  index: number,
  locale: Locale
): ShowcaseProject {
  const title = project.title?.trim() || `${getDefaultProjectLabel(locale)} ${index + 1}`;
  const label = project.label?.trim() || project.category?.trim() || getDefaultProjectLabel(locale);
  const description = project.description?.trim() || '';
  const image = project.image?.trim() || '/images/project-placeholder.jpg';
  const reviewUrl = project.reviewUrl?.trim() || undefined;

  return {
    id: String(project.id || index + 1),
    title,
    label,
    description,
    img: image,
    color: project.color?.trim() || showcaseColorPalette[index % showcaseColorPalette.length],
    reviewUrl,
  };
}

function localizeProject(project: ContentItem, locale: Locale): ContentItem {
  const translation = projectTranslations[project.id]?.[locale];

  return translation ? { ...project, ...translation } : project;
}

function localizeBlogPost(post: ContentItem, locale: Locale): LocalizedBlogPost {
  const translation = blogTranslations[post.id]?.[locale];

  if (!translation) {
    return {
      ...post,
      slug: ensureSlug(post.slug, post.title),
    };
  }

  return {
    ...post,
    ...translation,
    slug: ensureSlug(translation.slug, translation.title || post.title),
  };
}

export async function getPublicContent(locale: Locale): Promise<AppData> {
  const db = await getDb();

  return {
    ...db,
    portfolio: db.portfolio.map((project) => localizeProject(project, locale)),
    blog: db.blog.map((post) => localizeBlogPost(post, locale)),
  };
}

export async function getHomepageShowcaseProjects(locale: Locale): Promise<ShowcaseProject[]> {
  const db = await getDb();

  return db.portfolio.map((project, index) =>
    normalizeShowcaseProject(localizeProject(project, locale), index, locale)
  );
}

export async function getLocalizedBlogEntry(locale: Locale, slug: string) {
  const db = await getDb();
  const basePost = db.blog.find((post) => localizeBlogPost(post, locale).slug === slug);

  if (!basePost) {
    return null;
  }

  return {
    base: basePost,
    localizations: {
      tr: localizeBlogPost(basePost, 'tr'),
      en: localizeBlogPost(basePost, 'en'),
    },
  };
}

export async function getLocalizedBlogPosts(locale: Locale) {
  const db = await getPublicContent(locale);
  return db.blog.filter((post): post is LocalizedBlogPost => Boolean(post.slug));
}

export async function getLocalizedBlogPostBySlug(locale: Locale, slug: string) {
  const entry = await getLocalizedBlogEntry(locale, slug);
  return entry ? entry.localizations[locale] : null;
}

export async function getNextLocalizedBlogPostTitle(
  locale: Locale,
  currentSlug: string
) {
  const posts = await getLocalizedBlogPosts(locale);

  if (!posts.length) {
    return null;
  }

  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return posts[0]?.title || null;
  }

  const nextIndex = (currentIndex + 1) % posts.length;
  return posts[nextIndex]?.title || null;
}
