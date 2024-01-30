import { request } from '@strapi/helper-plugin';

export const api = {
  acceptChanges,
  declineChanges,
};

async function acceptChanges({ id }) {
  const data = await request(`/orcasa/project-changes/${id}/accept`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {},
  });
  return data;
}


async function declineChanges({ id }) {
  console.log('declineChanges go brr', id);
  const data = await request(`/orcasa/project-changes/${id}/decline`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {},
  });
  return data;
}
