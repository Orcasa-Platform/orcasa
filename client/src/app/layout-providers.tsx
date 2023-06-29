'use client';

import { PropsWithChildren, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <TooltipProvider>{children}</TooltipProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}
