'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header-wrap">
      <div className="site-header">
        <Link href="/" className="brand-link" aria-label="Go to home">
          XH.BLOG
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx('nav-link', active && 'nav-link-active')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
