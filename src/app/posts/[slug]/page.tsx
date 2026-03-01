import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { FadeIn } from '@/components/motion/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import { ArticleSeoJsonLd, BreadcrumbsSeoJsonLd } from '@/components/seo/json-ld';
import { BlogCard } from '@/components/ui/blog-card';
import { TagPill } from '@/components/ui/tag-pill';
import { getBlogById, getPublishedBlogs, getTags } from '@/lib/api';
import { formatDate, readingTimeFromMarkdown } from '@/lib/format';
import { siteConfig } from '@/lib/site';
import type { BlogListItem, Tag } from '@/types/blog';

export const dynamic = 'force-dynamic';

type PostPageProps = {
  params: {
    slug: string;
  };
};

function createTagLookup(tags: Tag[]): Record<number, Tag> {
  return tags.reduce<Record<number, Tag>>((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  }, {});
}

function normalizeSlug(raw: string): string {
  return decodeURIComponent(raw).trim();
}

async function resolveBlogBySlugParam(rawSlug: string): Promise<{
  allBlogs: BlogListItem[];
  matchedBlog: BlogListItem | null;
  redirectSlug: string | null;
}> {
  const slug = normalizeSlug(rawSlug);
  const allBlogs = await getPublishedBlogs();

  const directMatch = allBlogs.find((blog) => blog.slug === slug);
  if (directMatch) {
    return {
      allBlogs,
      matchedBlog: directMatch,
      redirectSlug: null
    };
  }

  if (/^\d+$/.test(slug)) {
    const legacyId = Number(slug);
    const legacyMatch = allBlogs.find((blog) => blog.id === legacyId);
    if (legacyMatch) {
      return {
        allBlogs,
        matchedBlog: legacyMatch,
        redirectSlug: legacyMatch.slug !== slug ? legacyMatch.slug : null
      };
    }
  }

  return {
    allBlogs,
    matchedBlog: null,
    redirectSlug: null
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { matchedBlog } = await resolveBlogBySlugParam(params.slug);
  if (!matchedBlog) {
    return { title: '文章不存在' };
  }

  const cover = matchedBlog.cover
    ? /^https?:\/\//i.test(matchedBlog.cover)
      ? matchedBlog.cover
      : `${siteConfig.url}${matchedBlog.cover.startsWith('/') ? matchedBlog.cover : `/${matchedBlog.cover}`}`
    : undefined;

  return {
    title: matchedBlog.title,
    description: matchedBlog.summary,
    alternates: {
      canonical: `/posts/${matchedBlog.slug}`
    },
    openGraph: {
      type: 'article',
      title: matchedBlog.title,
      description: matchedBlog.summary,
      publishedTime: matchedBlog.publishedAt,
      modifiedTime: matchedBlog.updatedAt,
      url: `${siteConfig.url}/posts/${matchedBlog.slug}`,
      images: cover ? [{ url: cover }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: matchedBlog.title,
      description: matchedBlog.summary,
      images: cover ? [cover] : undefined
    }
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const normalizedSlug = normalizeSlug(params.slug);
  const { allBlogs, matchedBlog, redirectSlug } = await resolveBlogBySlugParam(normalizedSlug);

  if (!matchedBlog) {
    notFound();
  }

  if (redirectSlug) {
    redirect(`/posts/${redirectSlug}`);
  }

  const [blog, tags] = await Promise.all([getBlogById(matchedBlog.id), getTags()]);

  if (!blog || !blog.isPublished) {
    notFound();
  }

  if (blog.slug !== normalizedSlug) {
    redirect(`/posts/${blog.slug}`);
  }

  const tagLookup = createTagLookup(tags);
  const relatedBlogs = allBlogs
    .filter((candidate) => candidate.id !== blog.id)
    .filter((candidate) => candidate.tagIds.some((tagId) => blog.tagIds.includes(tagId)))
    .slice(0, 3);

  return (
    <section className="page-grid">
      <ArticleSeoJsonLd
        title={blog.title}
        description={blog.summary}
        path={`/posts/${blog.slug}`}
        cover={blog.cover}
        publishedAt={blog.publishedAt}
        updatedAt={blog.updatedAt}
      />

      <BreadcrumbsSeoJsonLd
        items={[
          { position: 1, name: 'Home', item: siteConfig.url },
          { position: 2, name: 'Posts', item: `${siteConfig.url}/posts/${blog.slug}` },
          { position: 3, name: blog.title, item: `${siteConfig.url}/posts/${blog.slug}` }
        ]}
      />

      <FadeIn className="post-head">
        <p className="eyebrow">Article</p>
        <h1>{blog.title}</h1>
        <p className="post-meta">
          <span>{formatDate(blog.publishedAt)}</span>
          <span>·</span>
          <span>{readingTimeFromMarkdown(blog.markdown)}</span>
        </p>
        <p className="hero-description">{blog.summary}</p>

        <div className="post-tag-row">
          {blog.tagIds.map((tagId) => {
            const tag = tagLookup[tagId];
            if (!tag) {
              return null;
            }

            return <TagPill key={tag.id} id={tag.id} name={tag.name} />;
          })}
        </div>
      </FadeIn>

      <FadeIn className="markdown-shell" delay={0.06}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: 'wrap'
              }
            ]
          ]}
        >
          {blog.markdown}
        </ReactMarkdown>
      </FadeIn>

      {relatedBlogs.length > 0 && (
        <section>
          <h2 className="section-title">Related Posts</h2>
          <StaggerContainer className="post-list">
            {relatedBlogs.map((related) => (
              <StaggerItem key={related.id}>
                <BlogCard blog={related} tagLookup={tagLookup} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      <Link href="/" className="hero-action-link">
        返回首页
      </Link>
    </section>
  );
}
