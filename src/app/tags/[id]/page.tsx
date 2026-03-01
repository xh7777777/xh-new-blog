import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbsSeoJsonLd } from '@/components/seo/json-ld';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import { BlogCard } from '@/components/ui/blog-card';
import { getBlogsByIds, getTagById, getTags } from '@/lib/api';
import { siteConfig } from '@/lib/site';
import type { Tag } from '@/types/blog';

export const dynamic = 'force-dynamic';

type TagPageProps = {
  params: {
    id: string;
  };
};

function createTagLookup(tags: Tag[]): Record<number, Tag> {
  return tags.reduce<Record<number, Tag>>((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  }, {});
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return {
      title: 'Tag Not Found'
    };
  }

  const tag = await getTagById(id);
  if (!tag) {
    return {
      title: 'Tag Not Found'
    };
  }

  return {
    title: `标签：${tag.name}`,
    description: `查看 #${tag.name} 下的全部文章。`,
    alternates: {
      canonical: `/tags/${tag.id}`
    }
  };
}

export default async function TagDetailPage({ params }: TagPageProps) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const [tag, allTags] = await Promise.all([getTagById(id), getTags()]);

  if (!tag) {
    notFound();
  }

  const blogs = await getBlogsByIds(tag.articleIds);
  const tagLookup = createTagLookup(allTags);

  return (
    <section className="page-grid">
      <BreadcrumbsSeoJsonLd
        items={[
          { position: 1, name: 'Home', item: siteConfig.url },
          { position: 2, name: 'Tags', item: `${siteConfig.url}/tags` },
          { position: 3, name: tag.name, item: `${siteConfig.url}/tags/${tag.id}` }
        ]}
      />

      <div className="hero-card">
        <p className="eyebrow">Tag Archive</p>
        <h1>#{tag.name}</h1>
        <p className="hero-description">该标签下共有 {blogs.length} 篇已发布文章。</p>
        <Link href="/tags" className="hero-action-link">
          返回标签列表
        </Link>
      </div>

      {blogs.length > 0 ? (
        <StaggerContainer className="post-list">
          {blogs.map((blog) => (
            <StaggerItem key={blog.id}>
              <BlogCard blog={blog} tagLookup={tagLookup} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <p className="empty-state">该标签暂无已发布文章。</p>
      )}
    </section>
  );
}
