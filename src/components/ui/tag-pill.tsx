import clsx from 'clsx';
import Link from 'next/link';

type TagPillProps = {
  id: number;
  name: string;
  active?: boolean;
  count?: number;
};

export function TagPill({ id, name, active = false, count }: TagPillProps) {
  return (
    <Link
      href={`/tags/${id}`}
      className={clsx('tag-pill', active && 'tag-pill-active')}
      aria-label={`View posts in ${name}`}
    >
      <span>#{name}</span>
      {typeof count === 'number' && <span className="tag-pill-count">{count}</span>}
    </Link>
  );
}
