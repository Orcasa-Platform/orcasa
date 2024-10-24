'use client';

import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import env from '@/env.mjs';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type SurveyNavDialogProps = PropsWithChildren;

const SurveyNavDialog = ({ children }: SurveyNavDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const checkboxRef = useRef<HTMLButtonElement | null>(null);

  const onCloseDialog = useCallback(() => {
    setDialogOpen(false);

    const isCollapsedByDefault = checkboxRef.current
      ? checkboxRef.current.dataset['state'] === 'checked'
      : false;

    if (typeof window !== 'undefined' && isCollapsedByDefault) {
      localStorage.setItem('SURVEY_DIALOG_CLOSED', 'true');
    }
  }, []);

  useEffect(() => {
    const shouldBeOpen = localStorage.getItem('SURVEY_DIALOG_CLOSED') !== 'true';
    const isTimeLimited = !!env.NEXT_PUBLIC_SURVEY_DIALOG_EXPANDED_UNTIL;
    const isStillExpanded = isTimeLimited
      ? +new Date() < +new Date(env.NEXT_PUBLIC_SURVEY_DIALOG_EXPANDED_UNTIL as string)
      : false;

    setDialogOpen(shouldBeOpen && isStillExpanded);
  }, []);

  return (
    <Dialog open={dialogOpen} onOpenChange={onCloseDialog}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          setDialogOpen(true);
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="h-auto max-w-[520px]">
        <p className="font-serif text-2xl">Help us improve Impact4Soil!</p>
        <p className="text-sm">
          Share your feedback or your contact details by filling out the survey or emailing us at{' '}
          <a href="mailto:impact4soil@groupes.renater.fr" className="font-semibold text-green-700">
            impact4soil@groupes.renater.fr
          </a>
          .
        </p>
        <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="survey-hide"
              ref={checkboxRef}
              className="shrink-0 hover:border-gray-400"
            />
            <Label htmlFor="survey-hide" className="text-sm">
              {"Don't"} show this message again.
            </Label>
          </div>
          <Button variant="primary" asChild className="shrink-0" onClick={onCloseDialog}>
            <a
              href="https://groupes.renater.fr/limesurvey/index.php/622186"
              target="_blank"
              rel="noreferrer noopener"
            >
              Fill out survey
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyNavDialog;
