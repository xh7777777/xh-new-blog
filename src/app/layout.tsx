import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteWideJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: siteConfig.titleTemplate
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
    ],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }]
  },
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description
  },
  category: 'technology'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteWideJsonLd />
        <div className="bg-orb bg-orb-left" aria-hidden="true" />
        <div className="bg-orb bg-orb-right" aria-hidden="true" />
        <SiteHeader />
        <main className="main-shell">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
