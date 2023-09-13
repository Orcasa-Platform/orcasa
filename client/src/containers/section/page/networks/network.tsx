'use client';
import { useState } from 'react';

import { ArrowRight, Calendar, FolderOpen, Globe2 } from 'lucide-react';

import { cn } from '@/lib/classnames';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

import { Switch } from '@/components/ui/switch';
export default function Network({
  id,
  attributes,
  type,
}: ProjectListResponseDataItem & OrganizationListResponseDataItem & { type: string }) {
  const [checked, setChecked] = useState(false);
  if (!id) return null;
  const { name, short_description: shortDescription } = attributes || {};

  const openDetails = () => {
    // TOOD: Open details
  };

  const Icons = () => {
    if (type === 'project') {
      const { project_type, start_date: startDate, region_of_interventions } = attributes || {};
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
              <div className="text-base text-slate-500">{startDate}</div>
            </div>
          )}
          {regionName && (
            <div className="flex gap-2">
              <Globe2 className="h-6 w-6" />
              <div className="text-base text-slate-500">{regionName}</div>
            </div>
          )}
        </div>
      );
    }
    if (type === 'organization') {
      const { country } = attributes || {};
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

  return (
    <li key={id} className="mb-2 flex min-h-[240px] w-full gap-6 bg-gray-50 p-6">
      <div
        className={cn('h-10 w-[8px] min-w-[8px]', {
          'bg-sky-700': type === 'project',
          'bg-blue-400': type === 'organization',
        })}
      />
      <div className="flex w-full flex-col justify-between gap-6">
        <header className="flex flex-col gap-4">
          <div className="flex gap-2 text-2xl font-semibold leading-10">{name}</div>
          <Icons />
          <div className="text-base text-slate-500">{shortDescription}</div>
        </header>
        <div className="flex items-center justify-end gap-4">
          <div className="flex gap-2">
            <div className="text-base text-slate-500">See network in the map</div>
            <div className="flex h-6 w-11 items-center justify-center">
              <Switch
                checked={checked}
                onCheckedChange={() => setChecked(!checked)}
                color={type === 'project' ? 'sky' : 'blue'}
              />
            </div>
          </div>
          <button type="button" onClick={() => openDetails()} className="flex space-x-1">
            <div className="text-base font-semibold text-blue-400">See details</div>
            <ArrowRight className="h-6 w-6 text-blue-400" />
            <div className="relative h-6 w-6" />
          </button>
        </div>
      </div>
    </li>
  );
}
