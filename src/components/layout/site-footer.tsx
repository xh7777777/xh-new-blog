import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Xh777 Blog</p>
      <p>
        Built with codex · <Link href="/about">About me</Link> ·{' '}
        <Link href="/rss.xml">RSS</Link>
      </p>
    </footer>
  );
}
