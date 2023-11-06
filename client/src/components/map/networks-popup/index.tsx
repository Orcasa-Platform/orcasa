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
  type: 'project' | 'organization';
  properties: {
    countryName: string;
    organizations: OrganizationProperties[];
    projects: ProjectProperties[];
  };
} | null;

type NetworksPopupProps = {
  popup: PopupAttributes;
  setPopup: (popup: PopupAttributes | null) => void;
};

const NetworksPopup = ({ popup, setPopup }: NetworksPopupProps) => {
  const searchParams = useMapSearchParams();
  const [, setSidebarOpen] = useSidebarOpen();

  if (!popup) return null;

  const {
    type,
    properties: { countryName, organizations, projects },
  } = popup;

  const networks = type === 'project' ? projects : organizations;
  const networkClass = type === 'project' ? 'text-peach-700' : 'text-blue-500';

  return (
    <Popup
      latitude={popup.latitude}
      longitude={popup.longitude}
      closeOnClick={false}
      closeButton={false}
      offset={20}
      maxWidth="332px"
      className="gap- z-50 flex h-[332px] w-[332px] flex-col p-0 font-serif"
    >
      <div className="p-6 pr-12">
        <Button
          size="icon"
          onClick={() => setPopup(null)}
          className="absolute right-0 top-0 flex items-center justify-center bg-slate-700 p-0 text-white transition-colors hover:bg-slate-500 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <header className="pb-6 text-lg text-slate-700">
          <span>{type === 'project' ? 'Projects coordinated in ' : 'Organisations from '}</span>
          <span className="font-semibold">{countryName}</span>
        </header>
        <div className="flex max-h-[232px] flex-col items-start justify-start gap-2 overflow-y-auto">
          {networks.map(({ id, name, type }) => (
            <Link
              key={id}
              className={cn('text-left text-base font-semibold', networkClass)}
              href={`/network/${type}/${id}?${searchParams.toString()}`}
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
    </Popup>
  );
};

export default NetworksPopup;
