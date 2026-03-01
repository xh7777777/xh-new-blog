import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/fade-in';

export const metadata: Metadata = {
  title: '关于',
  description: '博客作者与站点说明。',
  alternates: {
    canonical: '/about'
  }
};

type TimelineItem = {
  title: string;
  subtitle: string;
  detail: string;
  period: string;
  active?: boolean;
};

const timeline: TimelineItem[] = [
  {
    title: 'Bachelor @ Shanghai University',
    subtitle: '计算机学院 · 计算机科学与技术',
    detail:
      '2020 至 2024 年完成本科阶段学习，系统覆盖数据结构、操作系统、数据库、计算机网络与软件工程，持续参与课程项目与团队协作开发。',
    period: '2020-2024'
  },
  {
    title: 'Intern @ Trip.com Group',
    subtitle: 'Front-End Engineering Intern',
    detail:
      '2023 年在携程集团前端团队实习，参与业务页面开发与交互优化，重点实践组件化开发、接口联调与线上问题排查。',
    period: '2023'
  },
  {
    title: 'Front-End Engineer @ Bailian Group',
    subtitle: 'E-commerce & Enterprise Digital Systems',
    detail:
      '2024 至 2025 年在百联集团担任前端工程师，面向电商与企业数字化场景推进功能迭代、性能优化与工程规范落地。',
    period: '2024-2025'
  },
  {
    title: 'Master @ City University of Hong Kong',
    subtitle: '计算机学院 · E-Commerce 专业',
    detail:
      '2025 至 2026 年继续攻读硕士，聚焦电子商务与计算领域交叉方向，关注工程技术在商业场景中的可落地应用。',
    period: '2025-2026',
    active: true
  }
];

export default function AboutPage() {
  return (
    <section className="page-grid about-timeline-page">
      <FadeIn className="hero-card">
        <p className="eyebrow">About</p>
        <h1>Education & Experience</h1>
        <p className="hero-description">
          这里是xh777，前端开发一枚，目前关注AI技术，希望能够分享学习生活。
        </p>
      </FadeIn>

      <div className="timeline-list" role="list" aria-label="Education and work timeline">
        {timeline.map((item, index) => (
          <FadeIn className="timeline-item-wrap" delay={0.05 + index * 0.06} key={item.title}>
            <article className="timeline-item" role="listitem">
              <div className="timeline-point-wrap" aria-hidden="true">
                <span className={`timeline-point ${item.active ? 'timeline-point-active' : ''}`} />
              </div>
              <div className="timeline-content">
                <h2 className="timeline-title">{item.title}</h2>
                <p className="timeline-subtitle">{item.subtitle}</p>
                <p className="timeline-detail">{item.detail}</p>
              </div>
              <p className="timeline-period">{item.period}</p>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
