import { useGetTestimonies } from '@/types/generated/testimony';

export const useTestimonies = () => {
  const query = useGetTestimonies({
    populate: '*',
    sort: 'order:asc',
  });
  return {
    ...query,
    testimonies: query.data?.data ?? [],
  };
};
