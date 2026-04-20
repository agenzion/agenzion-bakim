import rawData from '@/data/db.json';

export interface ContentItem {
  id: string;
  slug?: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  date?: string;
  category?: string;
  label?: string;
  reviewUrl?: string;
  color?: string;
  author?: {
    name: string;
    role: string;
    image: string;
  };
  tags?: string[];
  readingTime?: string;
}

export interface AppData {
  concepts: ContentItem[];
  portfolio: ContentItem[];
  blog: ContentItem[];
}

const localData = rawData as AppData;

function normalizeArray<T>(value: T[] | undefined, fallback: T[]) {
  return Array.isArray(value) ? value : fallback;
}

export async function getDb(): Promise<AppData> {
  return {
    concepts: normalizeArray(localData.concepts, []),
    portfolio: normalizeArray(localData.portfolio, []),
    blog: normalizeArray(localData.blog, []),
  };
}
