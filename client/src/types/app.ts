import { modules } from '@/constants/modules';

type ExtractSlug<T extends string> = T extends `/${infer slug}` ? slug : never;

export type Section = ExtractSlug<(typeof modules)[number]['href']>;
