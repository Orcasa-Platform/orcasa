'use client';

import Banner from '@/components/mobile-banner';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
type FooterButton = {
  label: string;
  count?: number;
  content: React.ReactNode;
};

const MobileFooterMenu = ({
  buttons,
  variant = 'light',
  section,
}: {
  buttons: FooterButton[];
  variant?: 'dark' | 'light';
  section: 'geospatial-data' | 'network' | 'practices' | 'datasets';
}) => {
  return (
    <div className="safe-area-inset-bottom fixed bottom-0 z-10 h-fit min-h-[60px] w-full lg:hidden">
      <Banner section={section} />
      <nav className="relative z-20 flex h-full transform divide-x bg-green-700 text-white">
        {buttons.map(({ label, count, content }) => (
          <Drawer key={label}>
            <DrawerTrigger className="flex-1">
              <Button
                variant="vanilla"
                key={label}
                className="flex items-center justify-center gap-2 px-4 py-2.5"
              >
                {label}
                {!!count && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-900 text-sm font-semibold">
                    {count}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent variant={variant} className="max-h-[80vh]">
              {content}
            </DrawerContent>
          </Drawer>
        ))}
      </nav>
    </div>
  );
};

export default MobileFooterMenu;
