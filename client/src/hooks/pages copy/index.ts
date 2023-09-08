import { useGetPagesId } from '@/types/generated/page';

export const usePage = (pageId: number) => {
  const query = useGetPagesId(pageId, { populate: '*' });
  const layerGroups = query?.data?.data?.attributes?.layer_groups?.data;
  const layerGroupIds = layerGroups?.map((layerGroup) => layerGroup.id);

  return {
    ...query,
    layerGroupIds,
  };
};
