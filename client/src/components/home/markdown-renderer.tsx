import React from 'react';

import Markdown, { Components } from 'react-markdown';

import sanitizeHtml from 'sanitize-html';

import { renderMarkup } from '@/lib/utils/markup-renderer';

interface Component {
  node: Components['p'];
}

const Renderer = React.forwardRef<
  HTMLDivElement,
  {
    content: string;
    variant?: 'bold' | 'lists';
    className?: string;
  }
>(({ content, variant, className }, ref) => {
  // Replace components for Markup
  const replace = (content: string) => {
    if (!variant) return content;
    const sanitizedHTML = sanitizeHtml(content, {
      allowedTags: ['p', 'strong', 'ul', 'ol', 'li'],
      allowedAttributes: {},
    });
    return renderMarkup(sanitizedHTML, variant);
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
      dangerouslySetInnerHTML={{ __html: replace(content) || '' }}
      className={className}
      // Description needs ref to calculate the height of the div
      ref={variant === 'lists' ? ref : undefined}
    />
  ) : (
    <Markdown className="whitespace-pre-wrap" components={components as Components}>
      {content}
    </Markdown>
  );
});

Renderer.displayName = 'Renderer';

export default Renderer;
