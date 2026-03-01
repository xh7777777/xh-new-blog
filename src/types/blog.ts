export interface BlogListItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  cover: string | null;
  isPublished: boolean;
  tagIds: number[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogDetail extends BlogListItem {
  markdown: string;
}

export interface Tag {
  id: number;
  name: string;
  articleIds: number[];
  createdAt: string;
  updatedAt: string;
}
