import { cn } from '@/lib/classnames';

export const renderMarkup = (html: string, variant: 'bold' | 'lists', className?: string) => {
  if (variant === 'bold') {
    return html
      .replace(/<p>/g, `<span class="${cn('mb-4 block text-xl', className)}">`)
      .replace(/<\/p>/g, '</span>')
      .replace(/<strong>/g, `<b class="${cn('text-xl font-bold text-green-700', className)}">`);
  }

  if (variant === 'lists') {
    return html
      .replace(/<p>/g, `<span class="${cn('mb - 4 block', className)}">`)
      .replace(/<\/p>/g, '</span>')
      .replace(
        /<ul>/g,
        `<ul class="${cn('list-inside list-disc leading-6 text-gray-700', className)}">`,
      )
      .replace(
        /<ol>/g,
        `<ol class="${cn(
          'list-inside list-decimal leading-6 text-gray-700 marker:font-semibold',
          className,
        )}">`,
      )
      .replace(/<li>/g, '<li class="mb-2">');
  }
};
