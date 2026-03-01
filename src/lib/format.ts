import { format } from 'date-fns';

export function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }
  return format(date, 'yyyy-MM-dd');
}

export function readingTimeFromMarkdown(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 240));
  return `${minutes} min read`;
}
