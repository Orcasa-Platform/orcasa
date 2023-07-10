'use client';

import ReactMarkdown from 'react-markdown';

import { LayerTyped } from '@/types/layers';

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Metadata(layer: LayerTyped) {
  const { title, metadata } = layer;
  const { description = '' } = metadata;

  return (
    <article className="max-h-[90svh] overflow-y-auto overflow-x-hidden p-6">
      <DialogHeader>
        <DialogTitle className="text-3xl">{title}</DialogTitle>
        <DialogDescription>
          <ReactMarkdown className="prose prose-sm prose-slate">{description}</ReactMarkdown>
        </DialogDescription>
      </DialogHeader>
    </article>
  );
}
