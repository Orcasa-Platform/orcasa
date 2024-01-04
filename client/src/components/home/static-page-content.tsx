import { getStaticPages } from '@/types/generated/static-page';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import ScrollToTop from '@/components/utils/scroll-to-top';

export default async function StaticPageContent({ slug }: { slug: string }) {
  const data = await getStaticPages({
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });
  const pageAttributes = data?.data?.[0]?.attributes;

  if (!pageAttributes || !pageAttributes.content) return null;
  const { title, content } = pageAttributes;

  return (
    <>
      <ScrollToTop />
      <h2 className="mb-10 font-serif text-3.5xl text-gray-700">{title}</h2>
      <MarkdownRenderer content={content as string} />
    </>
  );
}
