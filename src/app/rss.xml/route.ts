import { getRssXml } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rssXml = await getRssXml();
    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    });
  } catch {
    return new Response('Failed to load rss feed from backend service.', {
      status: 502,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
}
