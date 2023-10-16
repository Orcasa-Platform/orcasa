'use client';

import { ChevronRight, Calendar, FolderOpen, Globe2 } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
  Organization,
  Project,
} from '@/types/generated/strapi.schemas';

import type { OpenDetails } from '@/containers/section/page/pages/network';

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
      <div className="flex gap-4">
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
              {endDate ? ` - ${format({ id: 'formatDate', value: startDate })}` : ''}
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
  setOpenDetails,
}: ProjectListResponseDataItem &
  OrganizationListResponseDataItem & {
    type: 'project' | 'organization';
    setOpenDetails: (details: OpenDetails) => void;
  }) {
  if (!id) return null;
  const { name, short_description: shortDescription } = attributes || {};

  return (
    <li
      key={id}
      className={cn('mb-2 flex min-h-[240px] w-full gap-4 bg-gray-50 p-6 pl-0', {
        'bg-yellow-50': type === 'project',
        'bg-blue-50': type === 'organization',
      })}
    >
      <div className="flex w-full flex-col justify-between gap-6 px-12 py-6 text-base text-slate-500">
        <header className="flex flex-col gap-4">
          <div className="flex gap-2 font-serif text-2xl font-semibold leading-10 text-slate-700">
            {name}
          </div>
          <Icons type={type} attributes={attributes} />
          <p>{shortDescription}</p>
        </header>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setOpenDetails({ id, type })}
            className="flex space-x-1"
          >
            <div className="absolute left-[50px] top-2 text-xs font-normal leading-[18px] text-slate-700 opacity-0">
              Learn more
            </div>
            <div
              className={cn('flex h-[34px] w-[34px] flex-col items-center justify-center', {
                'bg-orange-100': type === 'project',
                'bg-blue-100': type === 'organization',
              })}
            >
              <ChevronRight className="relative h-6 w-6" />
            </div>
          </button>
        </div>
      </div>
    </li>
  );
}
