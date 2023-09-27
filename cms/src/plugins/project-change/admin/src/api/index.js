import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

export const api = {
  acceptChanges,
  declineChanges,
};

async function acceptChanges({ id }) {
  const data = await request(`/${pluginId}/project-change/${id}/accept-change`, {
    method: 'POST',
    body: {},
  });
  return data;
}

async function declineChanges({ id }) {
  const data = await request(`/${pluginId}/project-change/${id}/decline-change`, {
    method: 'POST',
    body: {},
  });
  return data;
}
