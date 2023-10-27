import { cn } from '@/lib/classnames';

import { Project } from '@/types/generated/strapi.schemas';

import { SlidingLinkButton } from '../ui/sliding-link-button';

import Document from '@/styles/icons/document.svg';
const Element = ({
  name,
  id,
  type,
}: Pick<Project, 'name'> & { id: number; type: 'organization' | 'project' }) => (
  <div
    className={cn(
      'flex h-20 w-[450px] items-center justify-between gap-4 border border-slate-700 p-4',
      {
        'bg-blue-50': type === 'organization',
        'bg-peach-50': type === 'project',
      },
    )}
  >
    <div className="text-sm text-slate-700">{name}</div>
    <SlidingLinkButton
      buttonClassName={cn('bg-blue-100 p-0 m-0', {
        'bg-blue-100': type === 'organization',
        'bg-peach-100': type === 'project',
      })}
      href={`/project/${id}`}
      position="right"
      Icon={Document}
    >
      Learn more
    </SlidingLinkButton>
  </div>
);

const NetworkDiagram = ({ data, id }: { data: Project; id: number }) => {
  const { name } = data;
  return (
    <div>
      <div className="my-6 border-t border-dashed border-t-gray-200" />
      <div className="mb-6 font-serif text-2xl text-slate-700">Network</div>
      <div className="flex gap-2">
        <div>
          <Element name={name} id={id} type="organization" />
        </div>
        <div className="flex w-[165px] flex-col gap-2 border border-dashed border-gray-300 p-6 text-slate-700">
          <div className="flex items-center gap-2">
            <span className="h-[3px] w-6 bg-gray-700" />
            <span>Coordinator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 border-t border-gray-700" />
            <span>Partner</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 border-t border-dashed border-gray-700" />
            <span>Funder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagram;
