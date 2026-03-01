import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatDate } from '@/lib/format';
import type { BlogListItem, Tag } from '@/types/blog';

type BlogCardProps = {
  blog: BlogListItem;
  tagLookup: Record<number, Tag>;
};

export function BlogCard({ blog, tagLookup }: BlogCardProps) {
  return (
    <article className="blog-card">
      <div className="blog-card-meta">
        <span>{formatDate(blog.publishedAt)}</span>
      </div>

      <h2>
        <Link href={`/posts/${blog.slug}`} className="blog-card-title-link">
          {blog.title}
        </Link>
      </h2>

      <p className="blog-card-summary">{blog.summary}</p>

      <div className="blog-card-footer">
        <div className="blog-card-tags">
          {blog.tagIds.slice(0, 3).map((tagId) => {
            const tag = tagLookup[tagId];
            if (!tag) {
              return null;
            }
            return (
              <Link key={tag.id} href={`/tags/${tag.id}`} className="tiny-tag-link">
                #{tag.name}
              </Link>
            );
          })}
        </div>

        <Link href={`/posts/${blog.slug}`} className="read-more-link" aria-label={`Read ${blog.title}`}>
          Read
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
