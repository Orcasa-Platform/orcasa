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

async function acceptProjectChanges({ id }) {
  const data = await request(`/orcasa/project-changes/${id}/accept`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {},
  });
  return data;
}

async function declineProjectChanges({ id }) {
  const data = await request(`/orcasa/project-changes/${id}/decline`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {},
  });
  return data;
}
