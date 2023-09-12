'use client';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

export default function Network({
  id,
  attributes,
  type,
}: ProjectListResponseDataItem & OrganizationListResponseDataItem & { type: string }) {
  if (!id) return null;

  const { name } = attributes || {};
  return (
    <li key={id} className="space-y-2.5">
      <header className="flex justify-between space-x-2.5 py-1 pl-2">
        <h4>{name}</h4>
        type: {type}
      </header>
    </li>
  );
}
