# xh-next-blog

Next.js 个人博客前端，包含首页、Tag 页、About 页（并补充了文章详情页），对接后端 API：
- `GET /blogs?isPublished=true`
- `GET /blogs/{id}`
- `GET /tags`
- `GET /tags/{id}`

## 启动

```bash
cd applications/xh-next-blog
npm install
npm run dev
```

默认前端运行在 `http://localhost:3001`。

## API 规则

- 开发环境：默认请求 `http://localhost:3000`
- 生产环境：默认请求 `${NEXT_PUBLIC_SITE_URL}/api`（即请求前自动带 `/api`）

可选环境变量：
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `SERVER_API_BASE_URL`

## SEO

已接入：
- Next Metadata API（title/description/openGraph/twitter/canonical）
- JSON-LD（Organization、SocialProfile、Article、Breadcrumb）
- `sitemap.ts` + `robots.ts`
- `next-sitemap`（build 后自动生成站点地图）
