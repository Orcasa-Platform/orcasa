import { modules } from '@/constants/modules';

export type Section = (typeof modules)[number]['href'] extends `/${infer slug}` ? slug : never;
