import { ScientificEvidenceStats } from '@/types/scientific-evidence';

import API from '@/services/api/scientific-evidence-stats';

export const getScientificEvidenceMockStats = (signal?: AbortSignal) => {
  return API<ScientificEvidenceStats>({
    url: '/scientific_evidence/mocks/data/charts/index.json',
    method: 'get',
    signal,
  });
};
