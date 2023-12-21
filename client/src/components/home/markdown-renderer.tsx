import Markdown from 'react-markdown';

const Renderer = ({ content }: { content: string }) => (
  <Markdown
    className="whitespace-pre-wrap"
    components={{
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      h2({ node, ...rest }) {
        return <h2 className="font-serif text-2xl text-gray-700" {...rest} />;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      h3({ node, ...rest }) {
        return <h3 className="font-serif text-xl text-gray-700" {...rest} />;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      p({ node, ...rest }) {
        return <p className="m-0 text-base leading-6 text-gray-700" {...rest} />;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ul({ node, ...rest }) {
        return <ul className="list-inside list-disc leading-6 text-gray-700" {...rest} />;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ol({ node, ...rest }) {
        return (
          <ol
            className="list-inside list-decimal leading-6 text-gray-700 marker:font-semibold"
            {...rest}
          />
        );
      },
    }}
  >
    {content}
  </Markdown>
);
export default Renderer;
