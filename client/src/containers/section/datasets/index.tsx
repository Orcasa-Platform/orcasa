'use client';

import { Section } from '@/types/app';

import DatasetsList from '@/containers/section/datasets/list';

export default function Datasets({ section }: { section: Section }) {
  return (
    <div className="space-y-5 p-5 text-slate-700">
      {section === 'map-layers' && (
        <>
          <h2 className="text-3.5xl font-serif">
            Identify <span className="font-semibold">areas of interest</span> for research or
            interventions.
          </h2>
          <p>
            Give context to your research visualising scientifically-reliable soil-related map
            layers.
          </p>
        </>
      )}
      <DatasetsList />
    </div>
  );
}