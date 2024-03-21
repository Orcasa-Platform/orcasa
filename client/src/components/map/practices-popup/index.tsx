import { Popup } from 'react-map-gl';

import Link from 'next/link';

import { X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useMapSearchParams, useSidebarOpen } from '@/store';

import type { PracticesProperties } from '@/hooks/practices';

import { Button } from '@/components/ui/button';
export type PopupAttributes = {
  longitude: number;
  latitude: number;
  properties: {
    countryName: string;
    practices: PracticesProperties[];
  };
} | null;

type PracticesPopupProps = {
  popup: PopupAttributes;
  setPopup: (popup: PopupAttributes | null) => void;
};

const PracticesPopup = ({ popup, setPopup }: PracticesPopupProps) => {
  const searchParams = useMapSearchParams();
  const [, setSidebarOpen] = useSidebarOpen();
  if (!popup) return null;

  const {
    properties: { countryName, practices },
  } = popup;

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
          <span>Practices in </span>
          <span className="font-semibold">{countryName}</span>
        </header>
        <div className="flex max-h-[232px] flex-col items-start justify-start gap-2 overflow-y-auto">
          {practices.map(({ id, title }) => (
            <Link
              key={id}
              className={cn('text-left text-base font-semibold text-brown-500')}
              href={`/practices/${id}?${searchParams.toString()}`}
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              {title || '-'}
            </Link>
          ))}
        </div>
      </div>
    </Popup>
  );
};

export default PracticesPopup;
