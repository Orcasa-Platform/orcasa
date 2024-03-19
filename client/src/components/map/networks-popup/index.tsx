import Link from 'next/link';

import { X } from 'lucide-react';
import { Popup } from 'react-map-gl/maplibre';

import { cn } from '@/lib/classnames';

import { useMapSearchParams, useSidebarOpen } from '@/store';

import type { OrganizationProperties, ProjectProperties } from '@/hooks/networks';

import { Button } from '@/components/ui/button';

export type PopupAttributes = {
  longitude: number;
  latitude: number;
  type: 'initiative' | 'organization';
  properties: {
    countryName: string;
    organizations: OrganizationProperties[];
    projects: ProjectProperties[];
  };
} | null;

type Type = 'initiative' | 'organization';
type NetworksPopupProps = {
  popup: PopupAttributes;
  setPopup: (popup: PopupAttributes | null) => void;
  parentType?: Type;
  parentName?: string | undefined;
};

const networkDetailSentencePart = (parentType: Type, parentName: string, type: Type) => {
  if (!parentType) return null;
  const parentSpan = <span className="font-semibold">{parentName}</span>;
  if (parentType === 'initiative')
    return (
      <span>
        {type === 'initiative' ? (
          <> related to {parentSpan}</>
        ) : (
          <> participating in {parentSpan}</>
        )}
      </span>
    );
  if (parentType === 'organization')
    return (
      <span>
        {type === 'initiative' ? (
          <> in which {parentSpan} participates</>
        ) : (
          <> related to {parentSpan}</>
        )}
      </span>
    );
};

const NetworksPopup = ({ popup, setPopup, parentType, parentName }: NetworksPopupProps) => {
  const searchParams = useMapSearchParams();
  const [, setSidebarOpen] = useSidebarOpen();
  if (!popup) return null;

  const {
    type,
    properties: { countryName, organizations, projects },
  } = popup;

  const networks = type === 'initiative' ? projects : organizations;
  const networkClass = type === 'initiative' ? 'text-peach-700' : 'text-blue-500';
  const listDiscClass = type === 'initiative' ? 'marker:text-peach-700' : 'marker:text-blue-500';

  return (
    <Popup
      latitude={popup.latitude}
      longitude={popup.longitude}
      closeOnClick={false}
      closeButton={false}
      offset={20}
      maxWidth="332px"
      className="z-50 flex h-[332px] w-[332px] flex-col p-0 font-serif"
    >
      <div className="p-6 pr-4">
        <Button
          size="icon"
          onClick={() => setPopup(null)}
          className="absolute right-0 top-0 flex items-center justify-center bg-slate-700 p-0 text-white transition-colors hover:bg-slate-500 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <header className="pb-6 text-lg text-slate-700">
          <span>
            {type === 'initiative' ? 'Initiatives coordinated in ' : 'Organisations from '}
          </span>
          <span className="font-semibold">{countryName}</span>
          {parentType && parentName && networkDetailSentencePart(parentType, parentName, type)}
        </header>
        <ul className="flex max-h-[232px] list-inside list-disc flex-col items-start justify-start gap-2 overflow-y-auto">
          {networks.map(({ id, name, type }) => (
            <li key={id} className={listDiscClass}>
              <Link
                className={cn('text-left text-base font-semibold', networkClass)}
                href={`/network/${
                  type === 'project' ? 'initiative' : type
                }/${id}?${searchParams.toString()}`}
                onClick={() => {
                  setSidebarOpen(true);
                }}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Popup>
  );
};

export default NetworksPopup;
