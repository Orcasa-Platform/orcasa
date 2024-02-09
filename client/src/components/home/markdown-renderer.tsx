import React from 'react';

import Markdown, { Components } from 'react-markdown';

import sanitizeHtml from 'sanitize-html';

import { cn } from '@/lib/classnames';

interface Component {
  node: Components['p'];
}

const Renderer = ({
  content,
  variant,
  textClass,
}: {
  content: string;
  variant?: 'page-intro';
  textClass?: string;
}) => {
  // Replace components for Markup
  const replace = (content: string) => {
    const sanitizedHTML = sanitizeHtml(content, {
      allowedTags: ['p', 'strong'],
      allowedAttributes: {},
    });

    return sanitizedHTML
      .replace(/<p>/g, '<span class="mb-4 block text-lg">')
      .replace(/<\/p>/g, '</span>')
      .replace(/<strong>/g, `<b class="${cn('text-lg font-semibold', textClass)}">`);
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
  return variant === 'page-intro' ? (
    <div dangerouslySetInnerHTML={{ __html: replace(content) }} />
  ) : (
    <Markdown className="whitespace-pre-wrap" components={components as Components}>
      {content}
    </Markdown>
  );
};
export default Renderer;
