/**
 * practice-import controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::practice-import.practice-import', ({ strapi }) => ({
  async import(ctx) {
    const practiceImport: Record<string, any> = await strapi.service('api::practice-import.practice-import').import();

    return practiceImport;
  },

  async decorate(ctx) {
    const practiceImport: Record<string, any> = await strapi.service('api::practice-import.practice-import').decorate();

    return practiceImport;
  },
}));
