type SanityQueryResponse<T> = {
  result?: T;
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '03ibs86g';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-20';
const token = process.env.SANITY_API_READ_TOKEN;

const host = token ? 'api.sanity.io' : 'apicdn.sanity.io';
const baseUrl = `https://${projectId}.${host}/v${apiVersion}/data/query/${dataset}`;

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  revalidate = 60
): Promise<T | null> {
  const searchParams = new URLSearchParams({ query });

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(`$${key}`, JSON.stringify(value));
  }

  try {
    const response = await fetch(`${baseUrl}?${searchParams.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate },
    });

    if (!response.ok) {
      throw new Error(`Sanity query failed with ${response.status}`);
    }

    const payload = (await response.json()) as SanityQueryResponse<T>;
    return payload.result ?? null;
  } catch (error) {
    console.error('Sanity fetch failed:', error);
    return null;
  }
}
