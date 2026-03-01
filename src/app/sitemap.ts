import type { MetadataRoute } from 'next';
import { getPublishedBlogs, getTags } from '@/lib/api';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `${siteConfig.url}/tags`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ];

  try {
    const [blogs, tags] = await Promise.all([getPublishedBlogs(), getTags()]);

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${siteConfig.url}/posts/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.9
    }));

    const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${siteConfig.url}/tags/${tag.id}`,
      lastModified: new Date(tag.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7
    }));

    return [...staticRoutes, ...blogRoutes, ...tagRoutes];
  } catch {
    return staticRoutes;
  }
}
