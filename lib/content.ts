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
  '1772396356432': {
    en: {
      slug: 'title-goes-here',
      title: 'Title Goes Here',
      description: 'Description goes here',
      content: '<p>New content goes here...</p>',
    },
  },
  '1': {
    en: {
      slug: 'modern-web-design-trends',
      title: 'Modern Web Design Trends',
      description: 'Design approaches and technology shifts standing out in 2024.',
    },
  },
  '2': {
    en: {
      slug: 'why-speed-and-performance-matter',
      title: 'Why Speed and Performance Matter',
      description:
        'Technical optimizations and strategies that improve the user experience.',
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
    blog: db.blog.map((post) => localizeBlogPost(post, locale)),
  };
}

export async function getHomepageShowcaseProjects(locale: Locale): Promise<ShowcaseProject[]> {
  const db = await getDb();

  return db.portfolio.map((project, index) =>
    normalizeShowcaseProject(project, index, locale)
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
