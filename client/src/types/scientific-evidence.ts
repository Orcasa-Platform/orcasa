export interface ScientificEvidenceStats {
  [key: string]: {
    name: string;
    publications: number;
    metaAnalysis: number;
    mainInterventions: Array<string>;
  };
}
