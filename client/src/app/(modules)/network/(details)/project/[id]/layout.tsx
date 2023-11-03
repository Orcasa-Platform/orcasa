'use client';

import { useEffect } from 'react';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

export default function ProjectDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const [, setSidebarScroll] = useSidebarScrollHelpers();

  // We make sure to scroll to the top when navigating to the details view
  useEffect(() => {
    setSidebarScroll(0);
  }, [setSidebarScroll, params]);

  return children;
}
