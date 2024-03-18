import { cn } from '@/lib/classnames';

export const renderMarkup = (html: string, variant: 'bold' | 'lists') => {
  if (variant === 'bold') {
    return html
      .replace(/<p>/g, '<span class="mb-4 block text-xl">')
      .replace(/<\/p>/g, '</span>')
      .replace(/<strong>/g, `<b class="${cn('text-xl font-bold text-green-700')}">`);
  }

  if (variant === 'lists') {
    return html
      .replace(/<p>/g, '<span class="mb-4 block">')
      .replace(/<\/p>/g, '</span>')
      .replace(/<ul>/g, '<ul class="list-inside list-disc leading-6 text-gray-700">')
      .replace(
        /<ol>/g,
        '<ol class="list-inside list-decimal leading-6 text-gray-700 marker:font-semibold">',
      )
      .replace(/<li>/g, '<li class="mb-2">');
  }
};
