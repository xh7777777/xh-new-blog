import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  OrganizationJsonLd,
  SocialProfileJsonLd
} from 'next-seo';
import { siteConfig } from '@/lib/site';

type Crumb = {
  position: number;
  name: string;
  item: string;
};

type ArticleSeoJsonLdProps = {
  title: string;
  description: string;
  path: string;
  cover?: string | null;
  publishedAt: string;
  updatedAt?: string;
};

export function SiteWideJsonLd() {
  return (
    <>
      <OrganizationJsonLd
        useAppDir
        url={siteConfig.url}
        name={siteConfig.name}
        logo={`${siteConfig.url}/cover-default.svg`}
      />
      <SocialProfileJsonLd
        useAppDir
        type="Person"
        name={siteConfig.author}
        url={siteConfig.url}
        sameAs={[siteConfig.url]}
      />
    </>
  );
}

export function BreadcrumbsSeoJsonLd({ items }: { items: Crumb[] }) {
  return <BreadcrumbJsonLd useAppDir itemListElements={items} />;
}

export function ArticleSeoJsonLd({
  title,
  description,
  path,
  cover,
  publishedAt,
  updatedAt
}: ArticleSeoJsonLdProps) {
  const url = `${siteConfig.url}${path}`;
  const coverImage = cover
    ? /^https?:\/\//i.test(cover)
      ? cover
      : `${siteConfig.url}${cover.startsWith('/') ? cover : `/${cover}`}`
    : `${siteConfig.url}/cover-default.svg`;

  return (
    <ArticleJsonLd
      useAppDir
      type="BlogPosting"
      url={url}
      title={title}
      images={[coverImage]}
      datePublished={publishedAt}
      dateModified={updatedAt || publishedAt}
      authorName={siteConfig.author}
      description={description}
      isAccessibleForFree
    />
  );
}
