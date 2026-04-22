import type { AppData, ContentItem } from '@/lib/db';
import { getDb } from '@/lib/db';
import { type Locale, slugify } from '@/lib/i18n';
import { sanityFetch } from '@/lib/sanity';

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
type LocalizedBlogEntry = {
  base: ContentItem;
  localizations: Record<Locale, LocalizedBlogPost>;
};

const showcaseColorPalette = ['#06b6d4', '#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b'];

const PUBLIC_CONTENT_QUERY = /* groq */ `
{
  "concepts": [],
  "portfolio": *[_type == "project" && enabled != false] | order(order asc, _createdAt asc) {
    "id": coalesce(id, _id),
    "title": select($locale == "en" => coalesce(title.en, title.tr), coalesce(title.tr, title.en)),
    "description": select(
      $locale == "en" => coalesce(description.en, description.tr),
      coalesce(description.tr, description.en)
    ),
    "label": select(
      $locale == "en" => coalesce(label.en, category.en, label.tr, category.tr),
      coalesce(label.tr, category.tr, label.en, category.en)
    ),
    "category": select(
      $locale == "en" => coalesce(category.en, label.en, category.tr, label.tr),
      coalesce(category.tr, label.tr, category.en, label.en)
    ),
    "image": coalesce(image.asset->url, imagePath, "/images/project-placeholder.jpg"),
    reviewUrl,
    "color": coalesce(color, "#06B6D4"),
    "tags": coalesce(tags, [])
  },
  "blog": *[_type == "blogPost" && enabled != false] | order(order desc, publishedAt desc, _createdAt desc) {
    "id": coalesce(id, _id),
    "slug": select($locale == "en" => coalesce(slug.en, slug.tr), coalesce(slug.tr, slug.en)),
    "title": select($locale == "en" => coalesce(title.en, title.tr), coalesce(title.tr, title.en)),
    "description": select(
      $locale == "en" => coalesce(description.en, description.tr),
      coalesce(description.tr, description.en)
    ),
    "content": select(
      $locale == "en" => coalesce(bodyHtml.en, bodyHtml.tr),
      coalesce(bodyHtml.tr, bodyHtml.en)
    ),
    "image": coalesce(image.asset->url, imagePath, "/images/project-placeholder.jpg"),
    "date": publishedAt,
    "order": order,
    "category": select($locale == "en" => coalesce(category.en, category.tr), coalesce(category.tr, category.en)),
    author {
      name,
      "role": select($locale == "en" => coalesce(role.en, role.tr), coalesce(role.tr, role.en)),
      "image": coalesce(image.asset->url, imagePath, "/images/logo-koyu.png")
    },
    tags,
    "readingTime": select(
      $locale == "en" => coalesce(readingTime.en, readingTime.tr),
      coalesce(readingTime.tr, readingTime.en)
    )
  }
}
`;

const BLOG_ENTRY_QUERY = /* groq */ `
*[
  _type == "blogPost" &&
  enabled != false &&
  select($locale == "en" => coalesce(slug.en, slug.tr), coalesce(slug.tr, slug.en)) == $slug
][0]{
  "localizations": {
    "tr": {
      "id": coalesce(id, _id),
      "slug": coalesce(slug.tr, slug.en),
      "title": coalesce(title.tr, title.en),
      "description": coalesce(description.tr, description.en),
      "content": coalesce(bodyHtml.tr, bodyHtml.en),
      "image": coalesce(image.asset->url, imagePath, "/images/project-placeholder.jpg"),
      "date": publishedAt,
      "order": order,
      "category": coalesce(category.tr, category.en),
      author {
        name,
        "role": coalesce(role.tr, role.en),
        "image": coalesce(image.asset->url, imagePath, "/images/logo-koyu.png")
      },
      tags,
      "readingTime": coalesce(readingTime.tr, readingTime.en)
    },
    "en": {
      "id": coalesce(id, _id),
      "slug": coalesce(slug.en, slug.tr),
      "title": coalesce(title.en, title.tr),
      "description": coalesce(description.en, description.tr),
      "content": coalesce(bodyHtml.en, bodyHtml.tr),
      "image": coalesce(image.asset->url, imagePath, "/images/project-placeholder.jpg"),
      "date": publishedAt,
      "order": order,
      "category": coalesce(category.en, category.tr),
      author {
        name,
        "role": coalesce(role.en, role.tr),
        "image": coalesce(image.asset->url, imagePath, "/images/logo-koyu.png")
      },
      tags,
      "readingTime": coalesce(readingTime.en, readingTime.tr)
    }
  }
}
`;

const blogTranslations: Record<
  string,
  Partial<Record<Locale, Partial<ContentItem>>>
> = {
  'ai-destekli-seo-icerik-stratejisi': {
    en: {
      slug: 'ai-powered-seo-content-strategy',
      title: 'AI-Powered SEO Content Strategy: A Roadmap for a More Visible Website',
      description:
        'A practical SEO guide for using AI content while aligning search intent, technical structure, and a credible brand voice.',
      content:
        '<p>AI-powered content creation is not just about writing faster. Used well, it becomes a growth system that clarifies search intent, protects brand voice, and works with the technical SEO structure of a website.</p><h2>1. Focus on search intent, not only the topic</h2><p>A strong blog post is planned around the problem a user wants to solve, not around a single keyword. Before writing, define whether the reader wants to learn, compare options, or make a buying decision.</p><h2>2. Strengthen AI output with brand expertise</h2><p>AI can produce a useful first draft, but the real value appears when you add your company’s experience, examples, and point of view. Short industry scenarios, process notes, and decision criteria make the content distinctive.</p><h2>3. Keep technical structure close to content</h2><p>Heading hierarchy, description copy, readable URLs, fast-loading visuals, and internal links are core parts of SEO performance. Before publishing, every article should have one clear purpose, a useful summary, and a clear next step.</p><h2>4. Turn visuals into SEO assets</h2><p>Original visuals that match the topic improve how the article is perceived. File names, alt text, and the way an image is used in context all help search engines and users understand what the content is about.</p><h2>5. Measure and refresh after publishing</h2><p>SEO is not a one-time publishing task. Titles that get impressions but few clicks, pages that are read without producing leads, and outdated information should be reviewed and improved regularly.</p><p>In short, AI is a strong assistant that speeds up SEO work; it does not replace strategy. The best results come from combining AI production with real expertise, solid web infrastructure, and consistent performance tracking.</p>',
      category: 'SEO',
      readingTime: '5 min read',
      author: {
        name: 'Agenzion Web Studio',
        role: 'Web Design and SEO Team',
        image: '/images/logo-koyu.png',
      },
    },
  },
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
    tr: {
      title: 'PROJELER YAKINDA',
      description: 'Projelerimizi keşfetmeye hazır olun',
      label: 'WEB MASTERPIECES',
      category: 'WEB MASTERPIECES',
    },
    en: {
      title: 'PROJECTS COMING SOON',
      description: 'Get ready to discover our projects',
      label: 'WEB MASTERPIECES',
      category: 'WEB MASTERPIECES',
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

function getBlogPostOrder(post: ContentItem) {
  return typeof post.order === 'number' && Number.isFinite(post.order)
    ? post.order
    : Number.NEGATIVE_INFINITY;
}

function getBlogPostDateTimestamp(post: ContentItem) {
  if (!post.date) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = new Date(post.date).getTime();
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function sortBlogPosts<T extends ContentItem>(posts: T[]) {
  return [...posts].sort((a, b) => {
    const orderA = getBlogPostOrder(a);
    const orderB = getBlogPostOrder(b);

    if (orderA !== orderB) {
      return orderB - orderA;
    }

    const dateA = getBlogPostDateTimestamp(a);
    const dateB = getBlogPostDateTimestamp(b);

    if (dateA !== dateB) {
      return dateB - dateA;
    }

    return 0;
  });
}

function normalizeAppData(data: AppData): AppData {
  return {
    concepts: Array.isArray(data.concepts) ? data.concepts : [],
    portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
    blog: Array.isArray(data.blog) ? data.blog : [],
  };
}

async function getLocalPublicContent(locale: Locale): Promise<AppData> {
  const db = await getDb();

  return {
    ...db,
    portfolio: db.portfolio.map((project) => localizeProject(project, locale)),
    blog: db.blog.map((post) => localizeBlogPost(post, locale)),
  };
}

async function getSanityPublicContent(locale: Locale): Promise<AppData | null> {
  const data = await sanityFetch<AppData>(PUBLIC_CONTENT_QUERY, { locale });

  if (!data || (!data.portfolio?.length && !data.blog?.length)) {
    return null;
  }

  return normalizeAppData(data);
}

async function getSanityLocalizedBlogEntry(
  locale: Locale,
  slug: string
): Promise<LocalizedBlogEntry | null> {
  const entry = await sanityFetch<{ localizations: Record<Locale, LocalizedBlogPost> }>(
    BLOG_ENTRY_QUERY,
    { locale, slug }
  );

  if (!entry?.localizations?.[locale]) {
    return null;
  }

  return {
    base: entry.localizations[locale],
    localizations: entry.localizations,
  };
}

export async function getPublicContent(locale: Locale): Promise<AppData> {
  const sanityContent = await getSanityPublicContent(locale);
  return sanityContent || getLocalPublicContent(locale);
}

export async function getHomepageShowcaseProjects(locale: Locale): Promise<ShowcaseProject[]> {
  const db = await getPublicContent(locale);

  return db.portfolio.map((project, index) => normalizeShowcaseProject(project, index, locale));
}

export async function getLocalizedBlogEntry(locale: Locale, slug: string) {
  const sanityEntry = await getSanityLocalizedBlogEntry(locale, slug);

  if (sanityEntry) {
    return sanityEntry;
  }

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
  return sortBlogPosts(db.blog.filter((post): post is LocalizedBlogPost => Boolean(post.slug)));
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
