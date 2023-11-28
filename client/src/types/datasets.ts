export enum DatasetSource {
  Cirad = 'CIRAD',
  Harvard = 'HARVARD',
  Inrae = 'INRAE',
  JRC = 'JRC',
  Zenodo = 'ZENODO',
}

export interface Dataset {
  _id: string;
  title: string;
  publication_date: string;
  source: DatasetSource;
  short_description: string;
  authors: string | string[];
  url: string;
  doi?: string;
}

export type DatasetListResponseDataItem = Dataset;

export interface DatasetListResponse {
  meta: {
    total_records: number;
    page_size: string;
    page_number?: string;
  };
  data: DatasetListResponseDataItem[];
}

export type GetDatasetsParams = {
  page?: number;
  size?: number;
  q?: string;
  source?: string;
  minDate?: string;
  maxDate?: string;
};
