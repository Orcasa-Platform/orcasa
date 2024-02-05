import { request } from '@strapi/helper-plugin';

export const api = {
  acceptProjectChanges,
  declineProjectChanges,
  startPracticesImport,
  startPracticesDecoration
};

async function startPracticesImport() {
  const data = await request(`/orcasa/practice-import/import`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {},
  });
  return data;
}

async function startPracticesDecoration() {
  const data = await request(`/orcasa/practice-import/decorate`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {},
  });
  return data;
}
