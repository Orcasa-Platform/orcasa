'use client';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { useMapSearchParams } from '@/store';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
  Organization,
  Project,
} from '@/types/generated/strapi.schemas';

import Tag from '@/components/tag';
import InfoTooltip from '@/components/ui/info-tooltip';
import { SlidingLinkButton } from '@/components/ui/sliding-link-button';
import { WithEllipsis } from '@/components/ui/with-ellipsis';

const Icons = ({
  type,
  attributes,
  isWorldwide,
}: {
  type: 'project' | 'organization';
  attributes: Project | Organization | undefined;
  isWorldwide?: boolean;
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
    const projectTypeDescription = project_type?.data?.attributes?.description;
    const regionName = isWorldwide
      ? 'Worldwide'
      : region_of_interventions?.data?.map((r) => r.attributes?.name).join(', ');

    return (
      <div className="flex flex-wrap gap-x-1 gap-y-2">
        {regionName && (
          <Tag className="border-purple-500 text-purple-500">
            <WithEllipsis text={regionName} />
          </Tag>
        )}
        {startDate && (
          <Tag className="border-purple-500 text-purple-500">
            {format({ id: 'formatDate', value: startDate })}
            {endDate ? ` - ${format({ id: 'formatDate', value: endDate })}` : ''}
          </Tag>
        )}
        {projectType && (
          <Tag className="border-purple-500 text-purple-500">
            {projectTypeDescription ? (
              <InfoTooltip
                triggerContent={projectType}
                content={<p>{projectTypeDescription}</p>}
                className="max-w-[293px]"
              />
            ) : (
              projectType
            )}
          </Tag>
        )}
      </div>
    );
  }
  if (type === 'organization') {
    const { country, organization_type } = (attributes as Organization) || {};
    const countryName = country?.data?.attributes?.name;
    const organizationTypeName = organization_type?.data?.attributes?.name;
    return (
      <div className="flex flex-wrap gap-x-1 gap-y-2">
        <Tag>{countryName}</Tag>
        {organizationTypeName && (
          <Tag>
            <WithEllipsis text={organizationTypeName} />
          </Tag>
        )}
      </div>
    );
  }
  return null;
};

export default function Network({
  id,
  attributes,
  type,
  isWorldwide,
}: ProjectListResponseDataItem &
  OrganizationListResponseDataItem & {
    type: 'project' | 'organization';
    isWorldwide?: boolean;
  }) {
  const { name, short_description: shortDescription } = attributes || {};
  const searchParams = useMapSearchParams();

  return (
    <li
      key={id}
      className={cn(
        'mb-2 flex min-h-[232px] w-full gap-4 rounded-lg border border-white bg-white',
        {
          'border-purple-200 bg-purple-100': type === 'project',
        },
      )}
    >
      <div className="flex w-full flex-col justify-between gap-4 p-6 text-gray-500">
        <header className="flex flex-col gap-4">
          <Icons type={type} attributes={attributes} isWorldwide={isWorldwide} />
          <div className="font-serif text-lg leading-7 text-gray-700">{name}</div>
          <p className="text-xs leading-5">{shortDescription}</p>
        </header>
        <div className="flex items-center justify-end">
          <SlidingLinkButton
            Icon={ChevronRight}
            position="right"
            href={`/network/${
              type === 'project' ? 'initiative' : type
            }/${id}?${searchParams.toString()}`}
            buttonClassName={cn({
              'bg-purple-200 group-hover:bg-purple-500 group-focus:bg-purple-500 group-focus:ring-purple-500':
                type === 'project',
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
