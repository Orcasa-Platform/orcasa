import { useGetPagesId } from '@/types/generated/page';

export const usePage = (pageId: number) => {
  const query = useGetPagesId(pageId, { populate: '*' });
  const layerGroups = query?.data?.data?.attributes?.layer_groups?.data || [];
  const layerGroupIds: number[] = layerGroups
    .map((layerGroup) => layerGroup.id)
    .filter((id): id is number => typeof id === 'number');

  return {
    ...query,
    layerGroupIds,
  };
};
