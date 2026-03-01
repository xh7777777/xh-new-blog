import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Xh777 Blog</p>
      <p>
        Built with Next.js · <Link href="/about">About this site</Link>
      </p>
    </footer>
  );
}
