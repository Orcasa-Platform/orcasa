// This is a solution to the problem of preventing the user from leaving the page when there are unsaved changes. It is a hook that listens to the beforeunload event and the click event on links. It also listens to the popstate event to detect when the user presses the back button. It is a workaround for the lack of a proper way to prevent the user from leaving the page in Next.js. The hook returns an object with a single method onBeforeUnload that should be called when the user tries to leave the page. If the method returns true, the user will be prompted with a confirmation message. If the user confirms, the page will be navigated to the new location.
// Next 13 and 14 has removed the router events, so we have to use this workaround for now.
// https:github.com/vercel/next.js/discussions/42016#discussioncomment-7668405

import { useEffect } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useIsFormDirty } from '@/store/network';

const clickType = typeof document !== 'undefined' && document.ontouchstart ? 'touchstart' : 'click';

interface GuardEventListener {
  onBeforeUnload: () => boolean;
}

function usePageUnloadGuard(confirmMessage: string, callbackFunction: () => void) {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const listener: GuardEventListener = {
    onBeforeUnload: () => false,
  };

  const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    listener.onBeforeUnload() && event.preventDefault();
  };

  const clickHandler = (event: MouseEvent | TouchEvent) => {
    if ((event as MouseEvent).button || event.which !== 1) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    if (!anchor) {
      return;
    }
    const newPath = anchor.getAttribute('href');
    if (newPath && newPath !== window.location.pathname && listener.onBeforeUnload()) {
      event.preventDefault();
      if (confirm(confirmMessage)) {
        callbackFunction();
        router.push(newPath);
      }
    }
  };

  const popStateHandler = (event: PopStateEvent) => {
    if (event.state !== null) {
      return;
    }
    if (listener.onBeforeUnload() && confirm(confirmMessage)) {
      window.removeEventListener('popstate', popStateHandler);
      history.back();
      return;
    }
    // Returning to the fake history state
    history.go(1);
  };

  useEffect(() => {
    // Since 'popstate' fires at the end of the page swap, there is no option to
    // cancel it. So we're adding artificial state and in case we got there,
    // it means a user pressed back button.
    // TODO: Check if it is safe to add these to deps so the effect will re-run with pathname and params change
    history.pushState(null, '', pathname + (searchParams?.toString() ?? ''));
    window.addEventListener('beforeunload', beforeUnloadHandler);
    window.addEventListener('popstate', popStateHandler);
    window.document.addEventListener(clickType, clickHandler, { capture: true });
    return () => {
      window.removeEventListener('popstate', popStateHandler);
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      window.document.removeEventListener(clickType, clickHandler, { capture: true });
    };
  });

  return listener;
}

const useBeforeUnloadDirtyForm = (form: { formState: { isDirty: boolean } } | undefined) => {
  const [isFormDirty, setIsFormDirty] = useIsFormDirty();
  const listener = usePageUnloadGuard(
    `You are about to leave the form, and the information you've filled out so far will be deleted.`,
    () => setIsFormDirty(false),
  );

  listener.onBeforeUnload = () => isFormDirty;

  const isDirty = form?.formState.isDirty;
  useEffect(() => {
    if (isDirty) {
      setIsFormDirty(isDirty);
    }
    return () => {
      if (!isDirty) {
        setIsFormDirty(false);
      }
    };
  }, [isDirty, setIsFormDirty]);
};

export default useBeforeUnloadDirtyForm;
