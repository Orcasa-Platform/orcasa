import { Practice } from '@/types/generated/strapi.schemas';

// Strapi doesn't allow the type to be an array, so we are temporarily asserting it here
// TODO: Check if we can fix this in the strapi schema or orval
export interface TypedPractice extends Omit<Practice, 'language'> {
  language: string[] | undefined;
}
