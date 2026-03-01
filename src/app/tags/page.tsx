import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import { TagPill } from '@/components/ui/tag-pill';
import { getPublishedBlogs, getTags } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '标签',
  description: '按标签浏览博客内容。',
  alternates: {
    canonical: '/tags'
  }
};

export default async function TagsPage() {
  const [tags, blogs] = await Promise.all([getTags(), getPublishedBlogs()]);

  const tagCountMap = blogs.reduce<Record<number, number>>((acc, blog) => {
    for (const tagId of blog.tagIds) {
      acc[tagId] = (acc[tagId] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedTags = [...tags].sort(
    (a, b) => (tagCountMap[b.id] || 0) - (tagCountMap[a.id] || 0)
  );

  return (
    <section className="page-grid">
      <FadeIn className="hero-card">
        <p className="eyebrow">Topic Index</p>
        <h1>Tags</h1>

      </FadeIn>

      <StaggerContainer className="tag-grid">
        {sortedTags.map((tag) => (
          <StaggerItem key={tag.id}>
            <div className="tag-card">
              <div className="tag-card-head">
                <strong>{tag.name}</strong>
              </div>
              <p className="tag-card-meta">{tagCountMap[tag.id] || 0} 篇文章</p>
              <TagPill id={tag.id} name={tag.name} count={tagCountMap[tag.id] || 0} />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
