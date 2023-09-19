import { request } from '@strapi/helper-plugin';

export const api = {
  acceptChanges,
};

async function acceptChanges({ slug }) {
  const data = await request(`/project-changes/${slug}/accept-changes`, {
    method: 'POST',
    body: {},
  });
  return data;
}
