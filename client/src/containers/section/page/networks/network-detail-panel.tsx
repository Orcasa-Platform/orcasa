'use client';

import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import { NetworkResponse } from '@/hooks/networks';

import type { OpenDetails } from '@/containers/section/page/pages/network';

import { SlidingButton, Button } from '@/components/ui/button';

import { getProjectFields, getOrganizationFields } from './network-detail-parsers';

export type ProjectWithType = { type: 'project'; attributes: Project; id: number };

export type OrganizationWithType = { type: 'organization'; attributes: Organization; id: number };

const isProject = (
  dataWithType: Data & { type: Type },
): dataWithType is ProjectWithType & { type: Type } => dataWithType.type === 'project';

const isOrganization = (
  dataWithType: Data & { type: Type },
): dataWithType is OrganizationWithType & { type: Type } => dataWithType.type === 'organization';

type Data = NetworkResponse['networks'][0] | null;
type Type = 'project' | 'organization' | undefined;
type Field = {
  label: string;
  value: string | (string | undefined)[] | undefined;
  url?: string | string[];
};

const Field = ({ label, value, url, type }: Field & { type: Type }) => {
  const renderLink = (url: string | string[]) =>
    Array.isArray(url) ? (
      <div>
        {url.map(
          (u, i) =>
            value?.[i] && (
              <>
                {i !== 0 ? ', ' : ''}
                <a
                  key={u}
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-peach-700"
                >
                  {value[i]}
                </a>
              </>
            ),
        )}
      </div>
    ) : (
      <a href={url} target="_blank" rel="noreferrer" className="text-sm text-peach-700">
        {value}
      </a>
    );

  return (
    <div className="flex gap-6">
      <div
        className={cn('text-sm font-semibold', {
          'w-[224px] min-w-[224px]': type === 'project',
          'w-[144px] min-w-[144px]': type === 'organization',
        })}
      >
        {label}
      </div>
      {url ? renderLink(url) : <div className="text-sm">{value}</div>}
    </div>
  );
};

export default function NetworkDetailPanel({
  data,
  type,
  setOpenDetails,
}: {
  data: Data;
  type: Type;
  setOpenDetails: (details: OpenDetails) => void;
}) {
  if (!data || !type) return null;
  const { attributes } = data || {};
  const { name, description } = attributes || {};
  let fields: Field[] = [{ label: 'Description', value: description }];
  const dataWithType = { ...data, type };
  let url;

  if (isProject(dataWithType)) {
    url = dataWithType.attributes?.website;
    fields = fields.concat(getProjectFields(dataWithType));
  }

  if (isOrganization(dataWithType)) {
    url = dataWithType.attributes?.url;
    fields = fields.concat(getOrganizationFields(dataWithType));
  }
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 h-full w-full -translate-x-full overflow-y-auto bg-white p-12',
        {
          'translate-x-0': !!data,
          '-translate-x-full': !data,
        },
      )}
    >
      <SlidingButton
        onClick={() => {
          setOpenDetails(null);
        }}
        text="Back to Results"
        Icon={ArrowLeft}
      />
      <div className="mb-6 mt-10 text-[34px] leading-[50px]">{name}</div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <Field key={field.label} {...field} type={type} />
        ))}
      </div>
      <div className="mt-10 flex justify-end gap-4">
        <Button disabled variant="secondary">
          <Pencil className="mr-2 h-6 w-6" />
          Suggest changes
        </Button>
        <Button asChild variant="secondary">
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-6 w-6" />
            Visit Website
          </a>
        </Button>
      </div>
    </div>
  );
}
