import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="page-grid">
      <div className="hero-card">
        <p className="eyebrow">404</p>
        <h1>页面不存在</h1>
        <p className="hero-description">你访问的页面可能已移动或被删除。</p>
        <Link href="/" className="hero-action-link">
          返回首页
        </Link>
      </div>
    </section>
  );
}
