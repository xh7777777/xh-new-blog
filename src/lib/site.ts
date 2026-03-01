function trimTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

const defaultSiteUrl = 'http://localhost:3001';

export const siteConfig = {
  name: 'Xh777 Blog',
  titleTemplate: '%s | Xh777 Blog',
  description:
    '一个使用 Next.js 构建的个人博客，聚焦工程实践、产品思考与 AI 应用记录。',
  author: 'Xiaohuan',
  email: 'hello@example.com',
  url: trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl),
  locale: 'zh_CN',
  keywords: [
    '个人博客',
    'Next.js',
    'TypeScript',
    'SEO',
    '工程实践',
    'AI'
  ]
};
