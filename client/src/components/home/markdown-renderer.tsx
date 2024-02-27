import React from 'react';

import Markdown, { Components } from 'react-markdown';

import sanitizeHtml from 'sanitize-html';

import { cn } from '@/lib/classnames';

interface Component {
  node: Components['p'];
}

const Renderer = React.forwardRef<
  HTMLDivElement,
  {
    content: string;
    variant?: 'page-intro' | 'description';
    textClass?: string;
    className?: string;
  }
>(({ content, variant, textClass, className }, ref) => {
  // Replace components for Markup
  const replace = (content: string) => {
    const sanitizedHTML = sanitizeHtml(content, {
      allowedTags: ['p', 'strong', 'ul', 'ol', 'li'],
      allowedAttributes: {},
    });

    if (variant === 'page-intro') {
      return sanitizedHTML
        .replace(/<p>/g, '<span class="mb-4 block text-lg">')
        .replace(/<\/p>/g, '</span>')
        .replace(/<strong>/g, `<b class="${cn('text-lg font-semibold', textClass)}">`);
    }

    if (variant === 'description') {
      return sanitizedHTML
        .replace(/<p>/g, '<span class="mb-4 block">')
        .replace(/<\/p>/g, '</span>')
        .replace(/<ul>/g, '<ul class="list-inside list-disc leading-6 text-gray-700">')
        .replace(
          /<ol>/g,
          '<ol class="list-inside list-decimal leading-6 text-gray-700 marker:font-semibold">',
        )
        .replace(/<li>/g, '<li class="mb-2">');
    }
    return sanitizedHTML;
  };

  // Replace components for Markdown
  const components = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h2({ node, ...rest }: Component) {
      return <h2 className="font-serif text-2xl text-gray-700" {...rest} />;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h3({ node, ...rest }: Component) {
      return <h3 className="font-serif text-xl text-gray-700" {...rest} />;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    p({ node, ...rest }: Component) {
      return <p className="m-0 text-base leading-6 text-gray-700" {...rest} />;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ul({ node, ...rest }: Component) {
      return <ul className="list-inside list-disc leading-6 text-gray-700" {...rest} />;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ol({ node, ...rest }: Component) {
      return (
        <ol
          className="list-inside list-decimal leading-6 text-gray-700 marker:font-semibold"
          {...rest}
        />
      );
    },
  };

  return !!variant ? (
    <div
      dangerouslySetInnerHTML={{ __html: replace(content) }}
      className={className}
      // Description needs ref to calculate the height of the div
      ref={variant === 'description' ? ref : undefined}
    />
  ) : (
    <Markdown className="whitespace-pre-wrap" components={components as Components}>
      {content}
    </Markdown>
  );
});

Renderer.displayName = 'Renderer';

export default Renderer;
