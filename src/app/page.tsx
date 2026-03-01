import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import { BlogCard } from '@/components/ui/blog-card';
import { getPublishedBlogs, getTags } from '@/lib/api';
import { siteConfig } from '@/lib/site';
import type { Tag } from '@/types/blog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '首页',
  description: '阅读最新博客内容，覆盖工程实践、开发心得和 AI 相关记录。',
  alternates: {
    canonical: '/'
  }
};

function createTagLookup(tags: Tag[]): Record<number, Tag> {
  return tags.reduce<Record<number, Tag>>((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  }, {});
}

export default async function HomePage() {
  const [blogs, tags] = await Promise.all([getPublishedBlogs(), getTags()]);
  const tagLookup = createTagLookup(tags);
  const latestBlog = blogs[0];

  return (
    <section className="page-grid">
      <FadeIn className="hero-card" delay={0.05}>
        <p className="eyebrow">Personal Notes & Engineering Log</p>
        <h1>{siteConfig.name}</h1>
        <p className="hero-description">
          欢迎访问我的博客！！
        </p>
        {latestBlog ? (
          <Link href={`/posts/${latestBlog.slug}`} className="hero-action-link">
            最新文章：{latestBlog.title}
          </Link>
        ) : (
          <p className="empty-tip">当前还没有已发布文章。</p>
        )}
      </FadeIn>

      <FadeIn className="section-title-wrap" delay={0.08}>
        <h2 className="section-title">Latest Posts</h2>
      </FadeIn>

      {blogs.length > 0 ? (
        <StaggerContainer className="post-list">
          {blogs.map((blog) => (
            <StaggerItem key={blog.id}>
              <BlogCard blog={blog} tagLookup={tagLookup} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <FadeIn className="empty-state" delay={0.1}>
          暂无内容，请先在后台发布文章。
        </FadeIn>
      )}
    </section>
  );
}
