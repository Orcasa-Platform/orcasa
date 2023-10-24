'use client';

import { useSearchParams } from 'next/navigation';

import { ChevronRight, Calendar, FolderOpen, Globe2 } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
  Organization,
  Project,
} from '@/types/generated/strapi.schemas';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';
import { WithEllipsis } from '@/components/ui/with-ellipsis';

const Icons = ({
  type,
  attributes,
}: {
  type: 'project' | 'organization';
  attributes: Project | Organization | undefined;
}) => {
  if (!attributes) return null;
  if (type === 'project') {
    const {
      project_type,
      start_date: startDate,
      end_date: endDate,
      region_of_interventions,
    } = (attributes as Project) || {};
    const projectType = project_type?.data?.attributes?.name;
    const regionName = region_of_interventions?.data?.map((r) => r.attributes?.name).join(', ');
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {projectType && (
          <div className="flex gap-2">
            <FolderOpen className="h-6 w-6" />
            <div className="text-base text-slate-500">{projectType}</div>
          </div>
        )}
        {startDate && (
          <div className="flex gap-2">
            <Calendar className="h-6 w-6" />
            <div className="text-base text-slate-500">
              {format({ id: 'formatDate', value: startDate })}
              {endDate ? ` - ${format({ id: 'formatDate', value: endDate })}` : ''}
            </div>
          </div>
        )}
        {regionName && (
          <div className="flex gap-2">
            <Globe2 className="h-6 w-6" />
            <div className="text-base text-slate-500">
              <WithEllipsis text={regionName} />
            </div>
          </div>
        )}
      </div>
    );
  }
  if (type === 'organization') {
    const { country } = (attributes as Organization) || {};
    const countryName = country?.data?.attributes?.name;
    return (
      <div className="flex gap-2">
        <Globe2 className="h-6 w-6" />
        <div className="text-base text-slate-500">{countryName}</div>
      </div>
    );
  }
  return null;
};

export default function Network({
  id,
  attributes,
  type,
}: ProjectListResponseDataItem &
  OrganizationListResponseDataItem & {
    type: 'project' | 'organization';
  }) {
  const { name, short_description: shortDescription } = attributes || {};
  const searchParams = useSearchParams();

  return (
    <li
      key={id}
      className={cn('mb-2 flex min-h-[240px] w-full gap-4 bg-gray-50', {
        'bg-peach-50': type === 'project',
        'bg-blue-50': type === 'organization',
      })}
    >
      <div className="flex w-full flex-col justify-between gap-6 px-12 py-10 text-base text-slate-500">
        <header className="flex flex-col gap-6">
          <Icons type={type} attributes={attributes} />
          <div
            className={cn('font-serif text-2xl leading-10', {
              'text-peach-700': type === 'project',
              'text-blue-500': type === 'organization',
            })}
          >
            {name}
          </div>
          <p>{shortDescription}</p>
        </header>
        <div className="flex items-center justify-end">
          <SlidingLinkButton
            Icon={ChevronRight}
            position="right"
            href={`/network/${type}/${id}?${searchParams.toString()}`}
            buttonClassName={cn({
              'bg-peach-100': type === 'project',
              'bg-blue-100': type === 'organization',
            })}
            // Next.js has a bug where the sidebar is not scrolled up to the top when navigating but
            // up to where `{children}` is visually located *within* the layout. Paddings around
            // `{children}` also causes issues.
            // For this reason, the automatic scroll restoration is disabled and manually set inside
            // `(details)/layout.tsx`.
            scroll={false}
          >
            Learn more
          </SlidingLinkButton>
        </div>
      </div>
    </li>
  );
}
