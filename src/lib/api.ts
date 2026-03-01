import type { BlogDetail, BlogListItem, Tag } from '@/types/blog';

const DEV_API_BASE = 'http://localhost:3000';

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function joinPath(base: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function getSiteBaseUrl(): string {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001');
}

function getServerApiBaseUrl(): string {
  const explicitServerBase = process.env.SERVER_API_BASE_URL;
  if (explicitServerBase) {
    return trimTrailingSlash(explicitServerBase);
  }

  const explicitPublicBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicitPublicBase && /^https?:\/\//i.test(explicitPublicBase)) {
    return trimTrailingSlash(explicitPublicBase);
  }

  if (process.env.NODE_ENV === 'production') {
    const apiPath = explicitPublicBase || '/api';
    if (/^https?:\/\//i.test(apiPath)) {
      return trimTrailingSlash(apiPath);
    }
    return joinPath(getSiteBaseUrl(), apiPath);
  }

  return DEV_API_BASE;
}

export function getBrowserApiBaseUrl(): string {
  const explicitPublicBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicitPublicBase) {
    return trimTrailingSlash(explicitPublicBase);
  }

  return process.env.NODE_ENV === 'production' ? '/api' : DEV_API_BASE;
}

const SERVER_API_BASE_URL = getServerApiBaseUrl();

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

async function requestJson<T>(
  path: string,
  init?: NextFetchInit,
  revalidate = 120
): Promise<T> {
  const url = joinPath(SERVER_API_BASE_URL, path);
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {})
    },
    next: {
      revalidate,
      ...(init?.next || {})
    }
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `Failed to request ${path}, status=${response.status}, body=${errorBody}`
    );
  }

  return (await response.json()) as T;
}

export async function getPublishedBlogs(): Promise<BlogListItem[]> {
  const blogs = await requestJson<BlogListItem[]>('/blogs?isPublished=true');
  return blogs.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogById(id: number): Promise<BlogDetail | null> {
  try {
    return await requestJson<BlogDetail>(`/blogs/${id}`);
  } catch {
    return null;
  }
}

export async function getTags(): Promise<Tag[]> {
  const tags = await requestJson<Tag[]>('/tags');
  return tags.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTagById(id: number): Promise<Tag | null> {
  try {
    return await requestJson<Tag>(`/tags/${id}`);
  } catch {
    return null;
  }
}

export async function getBlogsByIds(ids: number[]): Promise<BlogListItem[]> {
  if (!ids.length) {
    return [];
  }

  const query = new URLSearchParams({
    ids: ids.join(','),
    isPublished: 'true'
  });

  const blogs = await requestJson<BlogListItem[]>(`/blogs?${query.toString()}`);

  return blogs.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
